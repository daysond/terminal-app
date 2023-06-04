import { nanoid } from 'nanoid'
import { help, start } from '../command'
import { InvalidOutput, EchoCmd, InvalidOutputMsg, LsOutput, CatOutput, WelcomeBanner } from './Output'
import { useEffect, useRef, useState } from 'react'
import '../App.css'
import { createFS } from '../util/filesystem'

export default function Terminal({openEditor, outputs, setOutputs, previousCmds, setPreviousCmds, filesystemJSON, filesystemRootRef}) {
  
    const [directory, setDirectory ]= useState(createFS(filesystemJSON, null))
    const inputReference = useRef(null)
    const [userCommand, setUserCommand] = useState("")
    const [currentCmdIdx,  setCurrentCmdIdx] = useState(-1)
    const [cursorIdx, setCursorIdx] = useState(0)
    const [cmdPrompt, setCmdPrompt] = useState(`foobar:~/${directory.name} $ `)

  
      // Handle user command
    const handleChange = (event) => {
    setUserCommand(event.target.value.replace(/\r?\n|\r/g, ""))
    setCursorIdx(inputReference.current.selectionStart)
    // console.log(event.target.value)
  }

  const handleKeyDown = (event) => {

    if(event.key === 'Enter') {
      //TODO: FIRE COMMAND
      setPreviousCmds(prev => userCommand === previousCmds[0] ? prev : [userCommand, ...prev])
      setCurrentCmdIdx(-1)
      response()
      setUserCommand("")
    }

    if(event.key === 'ArrowUp') {
      event.preventDefault()

      if(!previousCmds.length) 
        return 

      const newIdx = (currentCmdIdx + 1) === previousCmds.length ? currentCmdIdx : currentCmdIdx + 1
      
      setCurrentCmdIdx(newIdx)
      setUserCommand(previousCmds[newIdx])

      const len = previousCmds[newIdx]?.length
      inputReference.current.setSelectionRange(len, len)
      setCursorIdx(len)
      
    }

    if(event.key === 'ArrowDown') {
        event.preventDefault()
        const newIdx = (currentCmdIdx - 1) <= -1 ? -1 : currentCmdIdx - 1
        setCurrentCmdIdx(newIdx)
        setUserCommand( newIdx === -1 ? "" : previousCmds[newIdx])

        const len = previousCmds[newIdx]?.length
        if(newIdx !== -1) {
          inputReference.current.setSelectionRange(len, len)
          setCursorIdx(len)
          
        }
    }

    if(event.key === 'ArrowLeft') {
      const caretPosition = inputReference.current.selectionStart;
      const newPos = caretPosition <= 1 ? 0 : caretPosition - 1
      setCursorIdx(newPos)
    }

    if(event.key === 'ArrowRight') {
      const caretPosition = inputReference.current.selectionStart;
      const newPos = caretPosition >= userCommand.length ? userCommand.length : caretPosition + 1
      setCursorIdx(newPos)
    }

    if(event.key === 'Tab') {
      console.log('tab')
      const inputs = userCommand.trimStart().split(" ").filter(e => e != "")
      const cmd = inputs[0]
      const arg = inputs[1]
  
    }
  }


 const focusTextArea = () => {
    inputReference.current.focus()
  }

  const requestNewChallenge = () => {

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }
    
    //TODO: ASYNC ? VALIDATE RES? is user able to request new challenge?
     fetch('/api/challenge/request', requestOptions)
    .then(res=>res.json())
    .then(json=>{

      const tempFs = filesystemJSON
      tempFs.children.push(json)
      setDirectory(createFS(tempFs, null))

    })
  
}

  const response = () => {
    console.log(`[${userCommand}]`)
    const inputs = userCommand.trimStart().split(" ").filter(e => e != "")
    const cmd = inputs[0]
    const arg = inputs[1]

    console.log(arg)
    switch (cmd) {
      case "clear":
        setOutputs([])
        break
      
      case "help":
        setOutputs(prevState => [...prevState,
        <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt} cmd={cmd}/>, ...help])
        break
      
      case "ls":

        setOutputs(prevState => [...prevState,
          <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt} cmd={cmd}/>,
          <LsOutput key={nanoid()} contents={directory.children} />])
        
        break

      case "cat": {

        // TODO: perform cd first??
        // find file name if exist? if not ?
        // file name is arg 

        const contents = inputs.map( (arg, index) => {
          if(index === 0) {
            return <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt} cmd={userCommand}/>
          }
          if (arg === "start_here.txt") {
            return start
          }

          const file = directory.children.filter(e=>e.name === arg)

          if(!file.length) {
             return  <InvalidOutputMsg key={nanoid()} cmd={userCommand} msg={"No such file or directory"} />
          }
          
          return (file[0].isFolder) ?
             <InvalidOutputMsg key={nanoid()} cmd={userCommand} msg={"is a directory"} />    
            : <CatOutput key={nanoid()} fileContent={file[0].content}/>

        })

        setOutputs(prevState => [...prevState,
          ...contents])
          return

          }

      case "cd":

          if(inputs.length > 2) {
            setOutputs(prevState => [...prevState,
            <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt}  cmd={userCommand}/>,
                <InvalidOutputMsg key={nanoid()} cmd={cmd} msg={"Too many arguments."} />])
          return 
          }

          if(!arg || arg === '.') {
            setOutputs(prevState => [...prevState,
              <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt} cmd={userCommand}/>])
          } else {

            let tempDir = directory
            const paths = arg.split('/')
            // absolute path starts with '/'
            
            if (arg === '/') {
              setDirectory(filesystemRootRef.current)
              setCmdPrompt(`foobar:~/${filesystemRootRef.current.name} $ `)
              setOutputs(prevState => [...prevState,
                <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt}  cmd={userCommand}/>])
              // setOutputs(prevState => [...prevState,
              //   <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt}  cmd={userCommand}/>,
              //   <LsOutput key={nanoid()} contents={directory.children} />])
              return
            }

            if (arg === '..' && tempDir.name === "root" ) {
              setOutputs(prevState => [...prevState,
                <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt}  cmd={userCommand}/>])
              return
            }

            if(paths[0] === '') {
              // paths.forEach(p => console.log(`[${p}]`))
              console.log("absolute " + paths.length)
              tempDir = filesystemRootRef.current
              paths.shift()
            }

            let shouldTerminate = false
            for (let i = 0; i < paths.length && !shouldTerminate; i++) {
              const path = paths[i]
              console.log("finding...(" + path + ")")
              switch (path){
                case ".":
                  break
                case "":
                  console.log("case . or notrhing ")
                  break
                
                case "..":
                  console.log("case ..")
                  if(tempDir.parent === null) {
                    shouldTerminate = true
                  } else {
                    tempDir = tempDir.parent
                  }
                  break
                
                default:{
                  const subDirIndex = tempDir.children.findIndex(subDir => subDir.name === path && subDir.isFolder)
                  if(subDirIndex === -1) {
                    shouldTerminate = true
                  } else {
                    tempDir = tempDir.children[subDirIndex]
                  }
                  
                  break
                }
                  // end of switch
                }
              }
  
            if(!shouldTerminate) {
              //REVIEW  CHANGE HERE
              setDirectory(tempDir)
              // fsRef = tempDir
              setCmdPrompt(`foobar:~/${tempDir.name} $ `)

              setOutputs(prevState => [...prevState,
                <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt}  cmd={userCommand}/>])
              // setOutputs(prevState => [...prevState,
              //   <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt}  cmd={userCommand}/>,
              //   <LsOutput key={nanoid()} contents={tempDir.children} />])

            } else {
              setOutputs(prevState => [...prevState,
                <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt}  cmd={userCommand}/>,
                <InvalidOutputMsg key={nanoid()} cmd={cmd} msg={`The directory '${arg}' does not exist`} />])
            }
          }
           
          break

      case "edit":
          if(!arg) {
              setOutputs(prevState => [...prevState,
                <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt}  cmd={userCommand}/>,
                <InvalidOutputMsg key={nanoid()} cmd={userCommand} msg={"No such file or directory"} />])
          } else {

            const file = directory.children.filter(e=>e.name === arg)

            if(!file.length) {
              setOutputs(prevState => [...prevState,
                <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt}  cmd={userCommand}/>,
                <InvalidOutputMsg key={nanoid()} cmd={cmd} msg={`${arg}: No such file or directory`} />])

            } else if (file[0].isFolder) {
              setOutputs(prevState => [...prevState,
                <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt} cmd={userCommand}/>,
                <InvalidOutputMsg key={nanoid()} cmd={cmd} msg={`${arg} is a directory`} />])
  
            } else {
              setOutputs(prevState => [...prevState,
                <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt} cmd={userCommand}/>])
                openEditor(file[0])
            }
          }
          break 


            // TODO: these commands not supported yet
      case "request":
        setOutputs(prevState => [...prevState,
          <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt} cmd={userCommand}/>])
          requestNewChallenge()
        break
      case "status":
        setOutputs(prevState => [...prevState,
          <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt} cmd={userCommand}/>])
        break 
      case "submit":
        setOutputs(prevState => [...prevState,
          <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt} cmd={userCommand}/>])
        break
      case "verify":
        setOutputs(prevState => [...prevState,
          <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt} cmd={userCommand}/>])
        break
      default:
        setOutputs(prevState => [...prevState,
          <EchoCmd key={nanoid()} cmdPrompt={cmdPrompt}  cmd={cmd}/>,
          <InvalidOutput key={nanoid()} cmd={cmd} />])
    }

  }

  const cmd = userCommand?.split('').map((c, index )=> 
      index === cursorIdx ?
      <span key={nanoid()} className="cmd-cursor cmd-blink">
        <span data-text="" className="end">
          <span style={{whiteSpace: 'pre'}}>{c}<span></span></span>
        </span>
      </span>
      : <span key={nanoid()}  style={{whiteSpace: 'pre'}}>{c}</span>)

  // console.log(cursorIdx)
  if (cursorIdx === userCommand.length || userCommand === "") {
    cmd.push(
      <span key={nanoid()} className="cmd-cursor cmd-blink">
        <span data-text="" className="end">
          <span>&nbsp;<span></span></span>
        </span>
      </span>
    )
  }


  return (
    <main className='console active terminal' onClick={focusTextArea}>
      <div className='terminal-wrapper' >
        <div className='terminal-output' >
        {outputs}
        </div>
        <div className="cmd enabled">
          <div className="cmd-wrapper">
            <span className="cmd-prompt">
              <span className='cmd-prompt' style={{width:`${cmdPrompt.length}ch`}} >{cmdPrompt}</span>
            </span>
            <div className="cmd-cursor-line" role="presentation" aria-hidden="true">
              {cmd}
            </div>
          </div>
          <textarea 
            autoCapitalize="off" 
            spellCheck="false" 
            tabIndex="1" 
            className="cmd-clipboard" 
            value={userCommand}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            ref={inputReference}
            style={{left: '150px', top: '350px', width: '70px', height: '56px'}}
            autoFocus />
        </div>
      </div>
    </main>
  )
  

}