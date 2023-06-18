import { nanoid } from "nanoid";
import { RequestWarning, help, start, verifyCode } from "../command";
import {
  InvalidOutput,
  EchoCmd,
  InvalidOutputMsg,
  LsOutput,
  CatOutput,
  Message,
} from "./Output";
import { useEffect, useRef, useState } from "react";
import { useLogout } from "../hooks/useLogout";
import "../App.css";
import { createFS } from "../util/filesystem";
import HTMLRenderer from "./HtmlRenderer";
import { HighlightedText, NewChallengeInfo } from "../command";

export default function Terminal({
  openEditor,
  outputs,
  setOutputs,
  previousCmds,
  setPreviousCmds,
  filesystemRootRef,
  user,
  directory,
  setDirectory,
  setDeadline,
  deadline,
}) {
  const { logout } = useLogout();

  const inputFieldReference = useRef(null);
  const [userCommand, setUserCommand] = useState("");
  const [currentCmdIdx, setCurrentCmdIdx] = useState(-1);
  const [cursorIdx, setCursorIdx] = useState(0);
  const username = user.email.split("@")[0];
  const [cmdPrompt, setCmdPrompt] = useState("");

  const terminalModes = {
    normal: "NORMAL",
    disable: "DISABLE",
    yesno: "YESNO",
  };
  const [terminalMode, setTerminalMode] = useState(terminalModes.normal);

  useEffect(() => {
    updateCommandPrompt(
      directory ? (directory.name === username ? "" : directory.name) : ""
    );
  }, [directory]);

  useEffect(() => {
    updateCommandPrompt(
      directory ? (directory.name === username ? "" : directory.name) : ""
    );
  }, [terminalMode]);

  // Handle user command
  const handleChange = (event) => {
    setUserCommand(event.target.value.replace(/\r?\n|\r/g, ""));
    // const {selectionStart} = event.target
    // console.log(selectionStart)
    setCursorIdx(inputFieldReference.current.selectionStart);
    // console.log(event.target.value)
  };

  const handleKeyDown = (event) => {
    if (terminalMode === terminalModes.disable) {
      return;
    }

    if (event.key === "Enter" && terminalMode === terminalModes.normal) {
      //TODO: FIRE COMMAND
      setPreviousCmds((prev) =>
        userCommand === previousCmds[0] ? prev : [userCommand, ...prev]
      );
      setCurrentCmdIdx(-1);
      response();
      setUserCommand("");
    }

    if (event.key === "Enter" && terminalMode === terminalModes.yesno) {
      handleYesNoSelection();
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (!previousCmds.length) return;

      const newIdx =
        currentCmdIdx + 1 === previousCmds.length
          ? currentCmdIdx
          : currentCmdIdx + 1;

      setCurrentCmdIdx(newIdx);
      setUserCommand(previousCmds[newIdx]);

      const len = previousCmds[newIdx]?.length;
      inputFieldReference.current.setSelectionRange(len, len);
      setCursorIdx(len);
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const newIdx = currentCmdIdx - 1 <= -1 ? -1 : currentCmdIdx - 1;
      setCurrentCmdIdx(newIdx);
      setUserCommand(newIdx === -1 ? "" : previousCmds[newIdx]);

      const len = previousCmds[newIdx]?.length;
      if (newIdx !== -1) {
        inputFieldReference.current.setSelectionRange(len, len);
        setCursorIdx(len);
      }
    }

    if (event.key === "ArrowLeft") {

      const caretPosition = inputFieldReference.current.selectionStart;
      console.log(caretPosition)
      const newPos = caretPosition <= 1 ? 0 : caretPosition - 1;
      setCursorIdx(newPos);
    }

    if (event.key === "ArrowRight") {

      const caretPosition = inputFieldReference.current.selectionStart;
      console.log(caretPosition)
      const newPos =
        caretPosition >= userCommand.length
          ? userCommand.length
          : caretPosition + 1;
      setCursorIdx(newPos);
    }

    if (event.key === "Tab") {
      event.preventDefault();
      const inputs = userCommand
        .trimStart()
        .split(" ")
        .filter((e) => e != "");

      if (inputs.length === 1) return;

      const arg = inputs[inputs.length - 1];
      const autoCompeletedCmd =
        userCommand.trimEnd().slice(0, -arg.length) + findDocumentMatches(arg);
      const len = autoCompeletedCmd.length;

      setUserCommand(autoCompeletedCmd);
      inputFieldReference.current.setSelectionRange(len, len);
      setCursorIdx(len);
    }
  };

  const focusTextArea = () => {
    inputFieldReference.current.focus();
  };

  //MARK: ---------- API HELPERS ----------

  const requestNewChallenge = async () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user?.token}`,
      },
    };

    const response = await fetch(
      "http://localhost:4000/api/challenge/request",
      requestOptions
    );

    const json = await response.json();

    if (response.ok) {
      // setFilesystemJSON(json)
      setTerminalMode(terminalModes.normal);
      console.log(json.intro);
      setDirectory(createFS(json.challenge, null));
      setDeadline(json.deadline);

      const user = JSON.parse(localStorage.getItem("user"));
      user.deadline = json.deadline;
      localStorage.setItem("user", JSON.stringify(user));

      setOutputs((prevState) => [
        ...prevState,
        <HighlightedText key={nanoid()} text={json.intro} />,
        <NewChallengeInfo
          key={nanoid()}
          name={json.name}
          timeLimit={json.timeLimit}
        />,
      ]);
    } else {
      //TODO: SET JSON
      setTerminalMode(terminalModes.normal);
      setOutputs((prevState) => [
        ...prevState,
        <InvalidOutputMsg
          key={nanoid()}
          cmd={"Request error"}
          msg={json.message}
        />,
      ]);
      console.log(json);
    }
    focusTextArea();
  };

  const submitChallenge = async (file) => {
    const level = file.parent.level;
    const code = file.content;

    console.log("submiting", code);

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify({ level, code }),
    };

    const response = await fetch(
      "http://localhost:4000/api/challenge/submit",
      requestOptions
    );

    const json = await response.json();

    if (response.ok) {
      // console.log(json);
      // file.editable = false;
      setOutputs((prevState) => [
        ...prevState,
        <InvalidOutputMsg key={nanoid()} cmd={"Submit"} msg={json.result} />,
      ]);
    } else {
      //TODO: SET JSON
      setOutputs((prevState) => [
        ...prevState,
        <InvalidOutputMsg key={nanoid()} cmd={"Submit"} msg={json.message} />,
      ]);
      console.log(json);
    }

    focusTextArea();
  };

  //MARK: ------------- TERMINAL RESPONSE -------------------

  const handleYesNoSelection = () => {
    const action = previousCmds[0];
    switch (userCommand.toUpperCase()) {
      case "Y":
        let msg = "";
        if (action === "request") {
          requestNewChallenge();
          msg = "Requesting new challenge...";
        }
        if (action === "submit") {
          submitChallenge(file);
          msg = "Submitting solution...";
        }
        setTerminalMode(terminalModes.disable);
        setOutputs((prevState) => [
          ...prevState,
          <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt} cmd={cmd} />,
          <Message key={nanoid()} msg={msg} />,
        ]);
        break;
      case "N":
        setTerminalMode(terminalModes.normal);

      default:
        console.log("default...");
        setOutputs((prevState) => [
          ...prevState,
          <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt} cmd={cmd} />,
        ]);
        break;
    }

    setCurrentCmdIdx(-1);
    setUserCommand("");
  };

  const response = () => {
    // console.log(`[${userCommand}]`);
    const inputs = userCommand
      .trimStart()
      .split(" ")
      .filter((e) => e != "");
    const cmd = inputs[0];
    const arg = inputs[1];

    console.log("Arg: ", arg);
    switch (cmd) {
      case "clear":
        setOutputs([]);
        break;

      case "help":
        setOutputs((prevState) => [
          ...prevState,
          <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt} cmd={cmd} />,
          ...help,
        ]);
        break;

      case "ls":
        setOutputs((prevState) => [
          ...prevState,
          <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt} cmd={cmd} />,
          <LsOutput key={nanoid()} contents={directory.children} />,
        ]);

        break;

      case "cat": {
        // TODO: perform cd first??
        // find file name if exist? if not ?
        // file name is arg
        const contents = inputs.map((arg, index) => {
          if (index === 0) {
            return (
              <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt} cmd={userCommand} />
            );
          }
          if (arg === "start_here.txt") {
            return start;
          }

          const file = directory.children.filter((e) => e.name === arg);

          if (!file.length) {
            return (
              <InvalidOutputMsg
                key={nanoid()}
                cmd={userCommand}
                msg={"No such file or directory"}
              />
            );
          }

          return file[0].isFolder ? (
            <InvalidOutputMsg
              key={nanoid()}
              cmd={userCommand}
              msg={"is a directory"}
            />
          ) : (
            <CatOutput key={nanoid()} fileContent={file[0].content} />
          );
        });

        setOutputs((prevState) => [...prevState, ...contents]);
        return;
      }

      case "cd":
        if (inputs.length > 2) {
          setOutputs((prevState) => [
            ...prevState,
            <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt} cmd={userCommand} />,
            <InvalidOutputMsg
              key={nanoid()}
              cmd={cmd}
              msg={"Too many arguments."}
            />,
          ]);
          return;
        }

        if (!arg || arg === ".") {
          setOutputs((prevState) => [
            ...prevState,
            <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt} cmd={userCommand} />,
          ]);
        } else {
          let tempDir = directory;
          const paths = arg.split("/");
          // absolute path starts with '/'

          if (arg === "/") {
            setDirectory(filesystemRootRef.current);
            updateCommandPrompt(
              filesystemRootRef.current.name === username
                ? ""
                : filesystemRootRef.current.name
            );
            setOutputs((prevState) => [
              ...prevState,
              <EchoCmd
                key={nanoid()}
                cmdPrompt={cmdPrompt}
                cmd={userCommand}
              />,
            ]);
            return;
          }

          if (arg === ".." && tempDir.name === "root") {
            setOutputs((prevState) => [
              ...prevState,
              <EchoCmd
                key={nanoid()}
                cmdPrompt={cmdPrompt}
                cmd={userCommand}
              />,
            ]);
            return;
          }

          if (paths[0] === "") {
            // paths.forEach(p => console.log(`[${p}]`))
            console.log("absolute " + paths.length);
            tempDir = filesystemRootRef.current;
            paths.shift();
          }

          let shouldTerminate = false;
          for (let i = 0; i < paths.length && !shouldTerminate; i++) {
            const path = paths[i];
            console.log("finding...(" + path + ")");
            switch (path) {
              case ".":
                break;
              case "":
                console.log("case . or notrhing ");
                break;

              case "..":
                console.log("case ..");
                if (tempDir.parent === null) {
                  shouldTerminate = true;
                } else {
                  tempDir = tempDir.parent;
                }
                break;

              default: {
                const subDirIndex = tempDir.children.findIndex(
                  (subDir) => subDir.name === path && subDir.isFolder
                );
                if (subDirIndex === -1) {
                  shouldTerminate = true;
                } else {
                  tempDir = tempDir.children[subDirIndex];
                }

                break;
              }
              // end of switch
            }
          }

          if (!shouldTerminate) {
            //REVIEW  CHANGE HERE
            setDirectory(tempDir);
            updateCommandPrompt(tempDir.name === username ? "" : tempDir.name);

            setOutputs((prevState) => [
              ...prevState,
              <EchoCmd
                key={nanoid()}
                cmdPrompt={cmdPrompt}
                cmd={userCommand}
              />,
            ]);
          } else {
            setOutputs((prevState) => [
              ...prevState,
              <EchoCmd
                key={nanoid()}
                cmdPrompt={cmdPrompt}
                cmd={userCommand}
              />,
              <InvalidOutputMsg
                key={nanoid()}
                cmd={cmd}
                msg={`The directory '${arg}' does not exist`}
              />,
            ]);
          }
        }

        break;

      case "edit":
        if (!arg) {
          setOutputs((prevState) => [
            ...prevState,
            <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt} cmd={userCommand} />,
            <InvalidOutputMsg
              key={nanoid()}
              cmd={userCommand}
              msg={"No such file or directory"}
            />,
          ]);
        } else {
          const file = directory.children.filter((e) => e.name === arg)[0];

          if (!file) {
            setOutputs((prevState) => [
              ...prevState,
              <EchoCmd
                key={nanoid()}
                cmdPrompt={cmdPrompt}
                cmd={userCommand}
              />,
              <InvalidOutputMsg
                key={nanoid()}
                cmd={cmd}
                msg={`${arg}: No such file or directory`}
              />,
            ]);
          } else if (file.isFolder) {
            setOutputs((prevState) => [
              ...prevState,
              <EchoCmd
                key={nanoid()}
                cmdPrompt={cmdPrompt}
                cmd={userCommand}
              />,
              <InvalidOutputMsg
                key={nanoid()}
                cmd={cmd}
                msg={`${arg} is a directory`}
              />,
            ]);
          } else if (!file.editable) {
            setOutputs((prevState) => [
              ...prevState,
              <EchoCmd
                key={nanoid()}
                cmdPrompt={cmdPrompt}
                cmd={userCommand}
              />,
              <InvalidOutputMsg
                key={nanoid()}
                cmd={cmd}
                msg={`${arg} is not editable`}
              />,
            ]);
          } else {
            setOutputs((prevState) => [
              ...prevState,
              <EchoCmd
                key={nanoid()}
                cmdPrompt={cmdPrompt}
                cmd={userCommand}
              />,
            ]);
            openEditor(file);
          }
        }
        break;

      case "request":
        setOutputs((prevState) => [
          ...prevState,
          <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt} cmd={userCommand} />,
          <RequestWarning key={nanoid()} />,
        ]);
        setTerminalMode(terminalModes.yesno);
        // requestNewChallenge();
        break;

      // TODO: these commands not supported yet
      case "status":
        setOutputs((prevState) => [
          ...prevState,
          <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt} cmd={userCommand} />,
        ]);
        break;

      case "submit":
        // TODO: REFACTOR CODE ... SAME CODE AS EDIT, only solution.py is submittable, check name?
        if (!arg) {
          setOutputs((prevState) => [
            ...prevState,
            <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt} cmd={userCommand} />,
            <InvalidOutputMsg
              key={nanoid()}
              cmd={userCommand}
              msg={"No such file or directory"}
            />,
          ]);
        } else {
          const file = directory.children.filter((e) => e.name === arg)[0];

          if (!file) {
            setOutputs((prevState) => [
              ...prevState,
              <EchoCmd
                key={nanoid()}
                cmdPrompt={cmdPrompt}
                cmd={userCommand}
              />,
              <InvalidOutputMsg
                key={nanoid()}
                cmd={cmd}
                msg={`${arg}: No such file or directory`}
              />,
            ]);
          } else if (file.isFolder) {
            setOutputs((prevState) => [
              ...prevState,
              <EchoCmd
                key={nanoid()}
                cmdPrompt={cmdPrompt}
                cmd={userCommand}
              />,
              <InvalidOutputMsg
                key={nanoid()}
                cmd={cmd}
                msg={`${arg} is a directory`}
              />,
            ]);
          } else if (!file.editable) {
            setOutputs((prevState) => [
              ...prevState,
              <EchoCmd
                key={nanoid()}
                cmdPrompt={cmdPrompt}
                cmd={userCommand}
              />,
              <InvalidOutputMsg
                key={nanoid()}
                cmd={cmd}
                msg={`${arg} is not submitable`}
              />,
            ]);
          } else {
            setOutputs((prevState) => [
              ...prevState,
              <EchoCmd
                key={nanoid()}
                cmdPrompt={cmdPrompt}
                cmd={userCommand}
              />,
            ]);
            submitChallenge(file);
          }
        }
        break;

      case "verify":
        console.log(verifyCode);
        setOutputs((prevState) => [
          ...prevState,
          <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt} cmd={userCommand} />,
          <HTMLRenderer htmlString={verifyCode} />,
        ]);
        break;
      case "logout":
        logout();
        break;
      default:
        setOutputs((prevState) => [
          ...prevState,
          <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt} cmd={cmd} />,
          <InvalidOutput key={nanoid()} cmd={cmd} />,
        ]);
    } // end of switch

    focusTextArea();
  };

  // MARK: HELPERS
  const updateCommandPrompt = (currentDir) => {
  

    switch (terminalMode) {
      case terminalModes.normal:
        setCmdPrompt(`foobar:~/${currentDir} ${username}$ `);
        break;
      case terminalModes.yesno:
        setCmdPrompt(`[Y]es or [N]o: `);
        break;
      default:
        setCmdPrompt("");
        break;
    }
  };

  const findDocumentMatches = (input) => {
    const matches = [];
    const options = directory.children.map((e) => e.name);
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      if (option.startsWith(input)) {
        matches.push(option);
      }
    }

    if (matches.length > 1) {
      const commonPrefix = matches[0];
      for (let i = 1; i < matches.length; i++) {
        const currentMatch = matches[i];
        let j = 0;
        while (j < commonPrefix.length && commonPrefix[j] === currentMatch[j]) {
          j++;
        }
        matches[0] = commonPrefix.substring(0, j);
      }
    }

    return matches.slice(0, 1);
  };

  //MARK: ---------- SET OUTPUT CMD ELEMENTS ----------

  const cmd = userCommand?.split("").map((c, index) =>
    index === cursorIdx ? (
      <span key={nanoid()} className="cmd-cursor cmd-blink">
        <span data-text="" className="end">
          <span style={{ whiteSpace: "pre" }}>
            {c}
            <span></span>
          </span>
        </span>
      </span>
    ) : (
      <span key={nanoid()} style={{ whiteSpace: "pre" }}>
        {c}
      </span>
    )
  );

  // console.log(cursorIdx)
  if (cursorIdx === userCommand.length || userCommand === "") {
    cmd.push(
      <span key={nanoid()} className="cmd-cursor cmd-blink">
        <span data-text="" className="end">
          <span>
            &nbsp;<span></span>
          </span>
        </span>
      </span>
    );
  }

  return (
    <main className="console active terminal" onClick={focusTextArea}>
      <div className="terminal-wrapper">
        <div className="terminal-output">{outputs}</div>
        <div className="cmd enabled">
          <div
            className="cmd-wrapper"
            hidden={terminalMode === terminalModes.disable}
          >
            <span className="cmd-prompt">
              <span
                className="cmd-prompt"
                style={{ width: `${cmdPrompt.length}ch` }}
              >
                {cmdPrompt}
              </span>
            </span>
            <div
              className="cmd-cursor-line"
              role="presentation"
              aria-hidden="true"
            >
              {cmd}
            </div>
          </div>
          <textarea
            disabled={terminalMode === terminalModes.disable}
            autoCapitalize="off"
            spellCheck="false"
            tabIndex="1"
            className="cmd-clipboard"
            value={userCommand}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            ref={inputFieldReference}
            style={{
              left: "150px",
              top: "350px",
              width: "70px",
              height: "56px",
            }}
            autoFocus
          />
        </div>
      </div>
    </main>
  );
}
