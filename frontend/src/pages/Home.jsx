import { useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";
import { WelcomeBanner } from "../components/Output";
import Split from "react-split";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/snippets/python";
import "ace-builds/src-noconflict/ext-language_tools";
import Terminal from "../components/Terminal";
import { getOperatingSystem, getTime } from "../util/OS";
import { absRoot, createFS } from "../util/filesystem";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { ErrorPage } from "./ErrorPage";
import { useLogout } from "../hooks/useLogout";
import { MountingPrompt, HighlightedText } from "../command";
import Countdown from "../components/Countdown";
import InstagramIcon from "../components/InstagramIcon";

export const Home = () => {
  const [os, setOS] = useState("Unknown");

  const { logout } = useLogout();
  const [outputs, setOutputs] = useState([]);
  const [previousCmds, setPreviousCmds] = useState([]);
  const filesystemRootRef = useRef(absRoot);
  // REVIEW:  get file system before home is loaded..?
  // TODO: CHANGE NEEDED

  const [directory, setDirectory] = useState(null)
  const [responseErr, setResponseErr] = useState(null)
  const { user } = useAuthContext()
  const [deadline, setDeadline] = useState(user.deadline)
  const username = user.email.split("@")[0]

  useEffect(() => {
    setOutputs([
      <WelcomeBanner key={nanoid()} />,
      <MountingPrompt key={nanoid()} username={username} />
    ]);
    setOS(getOperatingSystem(window));

    const fetchFileSystem = async () => {
      const response = await fetch("http://159.203.11.15:4000/api/challenge/", {
        headers: {
          authorization: `Bearer ${user?.token}`,
        },
      });

      const json = await response.json();

      if (response.ok) {
        console.log("[DEBUG] Got challenges ", json);
        // setFilesystemJSON(json)
        setDirectory(createFS(json, null));
        
        setOutputs(prev => [...prev,
          <HighlightedText key={nanoid()} text={json.children.filter(e=>e.name === "journal.txt")[0].content} />
        ])
      } else {
        setResponseErr({
          status: response.status,
          message: json.message,
          action: logout,
          actionName: " Go Home ",
        });
      }
    };

    if (user) {
      console.log("calling fetch ", user)
      fetchFileSystem();
    }
  }, [user]);

  //MARK: Editor States
  const [editorMode, setEditorMode] = useState(false);
  const [editorText, setEditorText] = useState("");
  const [editorFile, setEditorFile] = useState({});
  const [lastSaved, setLastSaved] = useState("");

  const handleEditorChange = (newValue) => {
    setEditorText(newValue);
  };

  const updateEidtorFile = (value) => {
    console.log("file ", value);
    setEditorMode(true);
    setEditorFile(value);
    setEditorText(value.content);
  };

  // MARK: ========== API CALLS ===========

  const savefile = async (level, content) => {
    setLastSaved(`Saving...`);
    const requestOptions = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify({ content: content, level: level }),
    };

    const response = await fetch(
      "http://159.203.11.15:4000/api/challenge/save",
      requestOptions
    );

    const json = await response.json();

    if (response.ok) {
      // setFilesystemJSON(json)
      // console.log(json);
      // setDirectory(createFS(json, null))
      setLastSaved(`Last saved: ${getTime()}`);
    } else {
      setLastSaved(`Error saving file: ${json.message}`);
    }
  };

  // ======================================

  const editorCommands = [
    {
      name: "close",
      bindKey: { win: "Ctrl-E", mac: "Cmd-E" },
      exec: () => {
        console.log("🚀, closing file.");
        setLastSaved("");
        setEditorText("");
        setEditorMode(false);
      },
    },
    {
      name: "save",
      bindKey: { win: "Ctrl-S", mac: "Cmd-S" },
      exec: (editor) => {
        const content = editor.getValue();
        const level = editorFile.parent.level;
        savefile(level, content);
        // console.log(editorFile.parent.level)
        editorFile.content = editor.getValue();

        console.log("🚀,  file saved.");
      },
    },
  ];

  //MARK: Props
  const terminalProps = {
    openEditor: updateEidtorFile,
    outputs,
    setOutputs,
    previousCmds,
    setPreviousCmds,
    directory,
    setDirectory,
    filesystemRootRef,
    user,
    setDeadline,
    deadline
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* {!user || responseErr || !directory ? (
          <Route path="/" element={<ErrorPage error={responseErr} />}></Route>
        ) : ( */}
        <Route
          path="/"
          element={
            <div className="home-main">
              { editorMode ? (
              <Split sizes={[50, 50]} direction="horizontal" className="split">
                <Terminal {...terminalProps} />
                <div className="editor">
                  {editorFile.name !== undefined && (
                    <div className="editor-header shadow">
                      <p className="editor-filename">{editorFile.name}</p>
                      <p className="editor-filename">{lastSaved}</p>
                    </div>
                  )}
                  <AceEditor
                    height="100%"
                    width="100%"
                    mode="python"
                    theme="monokai"
                    wrapEnabled={true}
                    showPrintMargin={false}
                    cursorStart={3}
                    setOptions={{
                      enableBasicAutocompletion: true,
                      enableLiveAutocompletion: true,
                      enableSnippets: true,
                    }}
                    commands={editorCommands}
                    focus={true}
                    value={editorText}
                    defaultValue={editorFile.content}
                    onChange={handleEditorChange}
                  />
                  <div className="editor-footer">
                    <p className="editor-cmd">
                      {" "}
                      [Save] {os === "Mac" ? "Cmd+S" : "Ctrl+S"} [Close]{" "}
                      {os === "Mac" ? "Cmd+E" : "Ctrl+E"}{" "}
                    </p>
                  </div>
                </div>
              </Split>
            ) : (
              <Terminal {...terminalProps} />
            )}
   
           <div className="home-footer">
              {deadline && <Countdown key={nanoid()} futureDate={deadline} />}
              <p>SESS Foobar</p>
              <div className="footer-contact">
                <p> Contact:</p>
                <InstagramIcon key={nanoid()}  />
              </div>
               
            </div>
          </div>
          }
        ></Route>
        {/* )} */}
      </Routes>
    </BrowserRouter>
  );
};

// export default Home
