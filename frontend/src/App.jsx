import { useEffect, useRef, useState } from 'react'
import { nanoid } from 'nanoid'
import { WelcomeBanner } from './components/Output'
import Split from 'react-split'
import AceEditor from 'react-ace'
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-monokai";
import 'ace-builds/src-noconflict/snippets/python'
import "ace-builds/src-noconflict/ext-language_tools";
import Terminal from './components/Terminal';
import { getOperatingSystem, getTime } from './OS'
import { absRoot, createFS } from './filesystem'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {

  const [os, setOS] = useState("Unknown")
  // Terminal States
  // const fsRef = useRef(root)
  const filesystemRootRef = useRef(absRoot)
  
  const [outputs, setOutputs] = useState([])
  const [previousCmds, setPreviousCmds] = useState([])
  
  //NOTE: ??
  const [filesystemJSON, setFilesystemJSON] = useState(null)

  useEffect(()=>{
    setOutputs([<WelcomeBanner key={nanoid()} />])
    setOS(getOperatingSystem(window))

    const fetchFileSystem = async () => {
      //TODO: VAlidate res ??? 
      await fetch('/api/challenge/')
        .then(res=>res.json())
        .then(json=>{
          setFilesystemJSON(json)
        })
      
      // if(res.ok) {
      //   console.log(json)
      //   // setFS(fs)
      // }
    }

    fetchFileSystem()

  }, [])


  //MARK: Editor States
  const [editorMode, setEditorMode] = useState(false)
  const [editorText, setEditorText] = useState("")
  const [editorFile, setEditorFile] = useState({})
  const [lastSaved, setLastSaved] = useState("")


  const handleEditorChange = (newValue) => {
    setEditorText(newValue)
  }

  const updateEidtorFile = (value) => {
    setEditorMode(true)
    setEditorFile(value)
    setEditorText(value.content)
  }

  const editorCommands = [
    {
      name: "close",
      bindKey: { win: "Ctrl-E", mac: "Cmd-E" },
      exec: () => {
        console.log("🚀, closing file.");
        setLastSaved("")
        setEditorText("")
        setEditorMode(false)
      },
    },
    {
      name: "save",
      bindKey: { win: "Ctrl-S", mac: "Cmd-S" },
      exec: (editor) => {
        console.log(editor.getValue())
        editorFile.content = editor.getValue()
        setLastSaved(`Last saved: ${getTime()}`)
        console.log("🚀,  file saved.");
      },
    },
  ]



  //MARK: Props

  const terminalProps = {
    openEditor: updateEidtorFile,
    outputs: outputs,
    setOutputs: setOutputs,
    previousCmds: previousCmds,
    setPreviousCmds: setPreviousCmds,
    // requestNewChallenge: requestNewChallenge,
    filesystemJSON: filesystemJSON,
    filesystemRootRef: filesystemRootRef,
  }

  return(
    filesystemJSON &&
    <BrowserRouter>
    <Routes>
       <Route 
         path='/'
         element={
          editorMode ? (
            <Split
            sizes={[50, 50]}
            direction="horizontal"
            className="split"
            >
            <Terminal {...terminalProps} />
            <div className='editor'>
              {editorFile.name !== undefined && 
              <div className='editor-header shadow'>
                <p className='editor-filename'>{editorFile.name}</p>
                <p className='editor-filename'>{lastSaved}</p>  
              </div>
              }
              < AceEditor 
                height='100vh'
                width='100%' 
                mode="python" 
                theme="monokai"
                wrapEnabled={true}
                showPrintMargin={false}
                cursorStart={3}
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: true
                }}
                commands={editorCommands}
                focus={true}
                value={editorText}
                defaultValue={editorFile.content}
                onChange={handleEditorChange}
              />
              <div className='editor-footer'>
              <p className='editor-cmd'> [Save] {os === "Mac" ? "Cmd+S" : "Ctrl+S"}      [Close] {os === "Mac" ? "Cmd+E" : "Ctrl+E"} </p>
              </div>
            </div>
          </Split>) 
          
          : ( <Terminal {...terminalProps} /> )
         }
       >
     
       </Route>
    </Routes>
    </BrowserRouter>
  )


}

export default App
