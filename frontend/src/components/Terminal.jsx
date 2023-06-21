import { nanoid } from "nanoid";
import {
  AllTestPassed,
  RequestWarning,
  SubmissionWarning,
  TestCaseResult,
  Help,
  start,
} from "../command";
import {
  InvalidOutput,
  EchoCmd,
  InvalidOutputMsg,
  LsOutput,
  CatOutput,
  Message,
} from "./Output";
import { useEffect, useRef, useState, useContext, useCallback, useLayoutEffect } from "react";
import { useLogout } from "../hooks/useLogout";
import "../App.css";
import { createFS } from "../util/filesystem";
import HTMLRenderer from "./HtmlRenderer";
import { HighlightedText, NewChallengeInfo } from "../command";
import { Progress } from "./Progress";
// import {useAuthContext} from "../hooks/useAuthContext";
import { AuthContext } from "../context/AuthContext";
import CanvasComponent from "../components/Canvas";

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
  editorMode
}) {
  const { logout } = useLogout();

  const inputFieldReference = useRef(null);
  const [userCommand, setUserCommand] = useState("");
  const [currentCmdIdx, setCurrentCmdIdx] = useState(-1);
  const [cursorIdx, setCursorIdx] = useState(0);
  const username = user.email.split("@")[0];
  const [cmdPrompt, setCmdPrompt] = useState("");
  const { dispatch } = useContext(AuthContext);
  const [caretPosition, setCaretPosition] = useState(null);
  const scrollEndViewRef = useRef(null);

  const terminalModes = {
    normal: "NORMAL",
    disable: "DISABLE",
    yesno: "YESNO",
  };
  const [terminalMode, setTerminalMode] = useState(terminalModes.normal);

  // MARK: ---------------------------- USEEFFECT --------------------------------------------------

  useEffect(() => {
    console.log("scrolllllllllllxxll ", outputs.length )
    scrollEndViewRef.current?.scrollIntoView({ behavior: "smooth" });
    if(!editorMode) focusTextArea();
  }, [outputs, editorMode]);

  useEffect(() => {
    updateCommandPrompt(
      directory ? (directory.name === username ? "" : directory.name) : ""
    );
  }, [terminalMode, directory]);

  useEffect(() => {
    setCursorIdx(caretPosition);
  }, [caretPosition]);


  // MARK: ---------------------- Handle user command ---------------------------------------------
  const handleChange = (event) => {
    setUserCommand(event.target.value.replace(/\r?\n|\r/g, ""));
    const { selectionStart } = event.target;
    setCaretPosition(selectionStart);
  };

  const handleKeyDown = (event) => {
    if (terminalMode === terminalModes.disable) {
      return;
    }

    if (event.key === "Enter" && terminalMode === terminalModes.normal) {
      //TODO: FIRE COMMAND
      if(userCommand !== '')
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
      if (!previousCmds.length) return;

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
      setCaretPosition(caretPosition <= 1 ? 0 : caretPosition - 1);
    }

    if (event.key === "ArrowRight") {
      setCaretPosition(
        inputFieldReference.current.selectionStart >= userCommand.length
          ? userCommand.length
          : caretPosition + 1
      );
    }

    if (event.key === "End") {
      setCaretPosition(userCommand.length);
    }

    if (event.key === "Home") {
      setCaretPosition(0);
    }

    if (event.key === "Tab") {
      event.preventDefault();
      const inputs = userCommand
        .trimStart()
        .split(" ")
        .filter((e) => e != "");

      if (inputs.length === 1) return;

      const arg = inputs[inputs.length - 1];
      const matches = findDocumentMatches(arg);
      if (!matches.length) return;

      const autoCompeletedCmd =
        userCommand.trimEnd().slice(0, -arg.length) +
        findDocumentMatches(arg)[0];
      const len = autoCompeletedCmd.length;
      setUserCommand(autoCompeletedCmd);
      inputFieldReference.current.setSelectionRange(len, len);
      setCursorIdx(len);
    }
  };

  //MARK: ------------------------------------ API HELPERS ----------------------------------------

  const requestNewChallenge = async () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user?.token}`,
      },
    };

    const response = await fetch(
      "http://159.203.11.15:4000/api/challenge/request",
      requestOptions
    );

    const json = await response.json();

    if (response.ok) {
      // setFilesystemJSON(json)
      setTerminalMode(terminalModes.normal);
      console.log(json);
      setDirectory(createFS(json.user.challenge, null));
      setDeadline(json.user.deadline);

      updateLocalUser(json.user);

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
  };

  const submitChallenge = async (file) => {
    const code = file.content;

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify({ code }),
    };
    console.log("submiting", requestOptions.body);
    const response = await fetch(
      "http://159.203.11.15:4000/api/challenge/submit",
      requestOptions
    );

    const json = await response.json();
    console.log(json);
    if (response.ok) {
      // console.log(json);
      // file.editable = false;
      if (json.status === "passed") {
        // setOutputs((prevState) => [
        //   ...prevState,
        //   <AllTestPassed key={nanoid()} />,
        // ]);

        setDirectory(createFS(json.user.challenge, null));
        setDeadline(json.deadline);
        setTerminalMode(terminalModes.normal);
        updateLocalUser(json.user);
        const submissionOutputElements = [
          <HTMLRenderer
            key={nanoid()}
            htmlString={`<p class='term-green'>Submission SUCCESSFUL.</p> `}
          />,
          <Progress key={nanoid()} user={json.user} />,
        ];
        if (user.level === 1) {
          submissionOutputElements.unshift(<CanvasComponent key={nanoid()} />);
        }
        setOutputs((prevState) => [...prevState, ...submissionOutputElements]);
        return;
      } else {
        setOutputs((prevState) => [
          ...prevState,
          <TestCaseResult key={nanoid()} result={json.result} />,
        ]);
      }
    } else {
      //TODO: SET JSON
      setOutputs((prevState) => [
        ...prevState,
        <HTMLRenderer
          key={nanoid()}
          htmlString={`<p class='term-warning'>${json.message}</p> `}
        />,
      ]);
      console.log(json);
    }
    setTerminalMode(terminalModes.normal);
    focusTextArea();
  };

  const verifyChallenge = async (file) => {
    const code = file.content;

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify({ code }),
    };

    const response = await fetch(
      "http://159.203.11.15:4000/api/challenge/verify",
      requestOptions
    );

    const json = await response.json();
    console.log(json);
    if (response.ok) {
      if (json.status === "passed") {
        setOutputs((prevState) => [
          ...prevState,
          <AllTestPassed key={nanoid()} />,
        ]);
      } else if (json.status === "failed") {
        setOutputs((prevState) => [
          ...prevState,
          <TestCaseResult key={nanoid()} result={json.result} />,
        ]);
      } else {
        setOutputs((prevState) => [
          ...prevState,
          <HTMLRenderer
            key={nanoid()}
            htmlString={`<p class='term-warning'> ${json.result} </p>`}
          />,
        ]);
      }
    } else {
      //TODO: SET JSON
      setOutputs((prevState) => [
        ...prevState,
        <HTMLRenderer
          key={nanoid()}
          htmlString={`<p class='term-warning'>${json.message}</p> `}
        />,
      ]);
      console.log(json);
    }
    setTerminalMode(terminalModes.normal);
    // focusTextArea();
  };

  //MARK: -------------------------------- TERMINAL RESPONSE --------------------------------------
  const handleYesNoSelection = (arg) => {
    const action = previousCmds[0]
      .trimStart()
      .split(" ")
      .filter((e) => e != "")[0];
    console.log("handling action", action);
    switch (userCommand.toUpperCase()) {
      case "Y":
        let msg = "";
        if (action === "request") {
          requestNewChallenge();
          msg = "Requesting new challenge...";
        }
        if (action === "submit") {
          submitChallenge(
            directory.children.filter((f) => f.name === "solution.py")[0]
          );
          msg = "Submitting solution...";
        }

        if (action === "verify") {
          verifyChallenge(
            directory.children.filter((f) => f.name === "solution.py")[0]
          );
          msg = "Verifying solution...";
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
          <Help key={nanoid()}/>,
        ]);
        break;

      //TODO: ls asdas, shows ls result... validate arg as well.
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

          if (arg === ".." && tempDir.name === username) {
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
        findFileWithTarget(cmd, arg, (arg) => {
          setOutputs((prevState) => [
            ...prevState,
            <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt} cmd={userCommand} />,
          ]);
          openEditor(arg);
        });

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
        printProgress();
        break;

      case "submit":
        findFileWithTarget(cmd, arg, (file) => {
          setOutputs((prevState) => [
            ...prevState,
            <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt} cmd={userCommand} />,
            <SubmissionWarning key={nanoid()} />,
          ]);
          setTerminalMode(terminalModes.yesno);
        });

        break;

      case "verify":
        setTerminalMode(terminalModes.disable);
        findFileWithTarget(cmd, arg, (file) => {
          verifyChallenge(file);
          setOutputs((prevState) => [
            ...prevState,
            <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt} cmd={userCommand} />,
            <Message key={nanoid()} msg={"Verifying solution..."} />,
          ]);
        });
        break;
      case "logout":
        logout();
        break;

      case undefined:
        setOutputs((prevState) => [
          ...prevState,
          <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt} cmd={""} />,
        ]);
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

  // MARK:----------------------------------- HELPERS ----------------------------------------------

  const updateLocalUser = (_user) => {
    const user = JSON.parse(localStorage.getItem("user"));
    user.deadline = _user.deadline;
    user.status = _user.status;
    user.level = _user.level;
    user.question = _user.question;
    user.totalLevelQuestions = _user.totalLevelQuestions;
    localStorage.setItem("user", JSON.stringify(user));

    dispatch({ type: "updated", payload: user });
  };

  const printProgress = () => {
    // TODO: AFTER submission, update local user object.
    setOutputs((prevState) => [
      ...prevState,
      <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt} cmd={userCommand} />,
      <Progress key={nanoid()} user={user} />,
    ]);
  };

  const findFileWithTarget = (cmd, arg, target) => {
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
          <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt} cmd={userCommand} />,
          <InvalidOutputMsg
            key={nanoid()}
            cmd={cmd}
            msg={`${arg}: No such file or directory`}
          />,
        ]);
      } else if (file.isFolder) {
        setOutputs((prevState) => [
          ...prevState,
          <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt} cmd={userCommand} />,
          <InvalidOutputMsg
            key={nanoid()}
            cmd={cmd}
            msg={`${arg} is a directory`}
          />,
        ]);
      } else if (!file.editable) {
        setOutputs((prevState) => [
          ...prevState,
          <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt} cmd={userCommand} />,
          <InvalidOutputMsg
            key={nanoid()}
            cmd={cmd}
            msg={`${arg} is systemt file.`}
          />,
        ]);
      } else {
        target(file);
      }
    }
  };

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

  const focusTextArea = () => {
    inputFieldReference.current.focus();
  };

  //MARK: ------------------------------ SET OUTPUT CMD ELEMENTS -------------------------------------

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

  if (cursorIdx === userCommand.length || userCommand === "") {
    cmd.push(
      <span key={nanoid()} className="cmd-cursor cmd-blink">
        <span data-text="" className="end">
          <span>&nbsp;</span>
        </span>
      </span>
    );
  }
 
  return (
    <main
      className="console active terminal"
      onClick={focusTextArea}
    >
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
        <div ref={scrollEndViewRef}></div>
        </div>
      </div>
    </main>
  );
}
