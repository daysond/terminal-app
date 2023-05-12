import { useEffect, useRef, useState } from 'react'
import './App.css'
import { nanoid } from 'nanoid'
import { help } from './command'
import { InvalidOutput, EchoCmd, InvalidOutputMsg, LsOutput, CatOutput, WelcomeBanner } from './components/Output'
import { data } from './data'

function App() {
  
  const cmdPromt = "foobar:~/sess$ "
  const inputReference = useRef(null)
  const [userCommand, setUserCommand] = useState("")
  const [outputs, setOutputs] = useState([])
  const [previousCmds, setPreviousCmds] = useState([])
  const [currentCmdIdx,  setCurrentCmdIdx] = useState(-1)
  const [cursorIdx, setCursorIdx] = useState(0)
  
  // Handle user command
  const handleChange = (event) => {
    setUserCommand(event.target.value.replace(/\r?\n|\r/g, ""))
    setCursorIdx(inputReference.current.selectionStart)
    // console.log(event.target.value)
  }

  const handleKeyDown = (event) => {
    // console.log(event.key)
    if(event.key === 'Enter') {
      //TODO: FIRE COMMAND
      setPreviousCmds(prev => userCommand === previousCmds[0] ? prev : [userCommand, ...prev])
      setCurrentCmdIdx(-1)
      response()
      setUserCommand("")
    }

    console.log("global " + inputReference.current.selectionStart)

    if(event.key === 'ArrowUp') {
      event.preventDefault()
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
      console.log("left: current pos " + caretPosition)
      const newPos = caretPosition <= 1 ? 0 : caretPosition - 1
      console.log("left: new pos  "+ newPos)
      setCursorIdx(newPos)
    }

    if(event.key === 'ArrowRight') {
      const caretPosition = inputReference.current.selectionStart;
      console.log(caretPosition)
      const newPos = caretPosition >= userCommand.length ? userCommand.length : caretPosition + 1
      console.log(newPos)
      setCursorIdx(newPos)

    }

    if(event.key === 'Tab') {
      console.log('tab')
    }


  }

  useEffect(()=>{
    setOutputs([<WelcomeBanner key={nanoid()} />])
    inputReference.current.focus()
  }, [])

  const focusTextArea = () => {
    console.log("clicked")
    inputReference.current.focus()
  }

  // Response to user command
  const response = () => {
    console.log(`[${userCommand}]`)
    const inputs = userCommand.trimStart().split(" ")
    const cmd = inputs[0]
    const arg = inputs[1]

    switch (cmd) {
      case "clear":
        setOutputs([])
        break
      
      case "help":
        setOutputs(prevState => [...prevState,
        <EchoCmd key={nanoid()} cmd={cmd}/>, ...help])
        break
      
      case "ls":
        const contents = [{
          name: "start.txt",
          isFolder: false,
          content: "start file"
        }, 
        {
          name: "challenges",
          isFolder: true,
          content: []
        }]

        setOutputs(prevState => [...prevState,
          <EchoCmd key={nanoid()} cmd={cmd}/>,
          <LsOutput key={nanoid()} contents={contents} />])
        
        break
      
      case "request":
        break

      case "cat":
        setOutputs(prevState => [...prevState,
          <EchoCmd key={nanoid()} cmd={cmd}/>,
          <CatOutput key={nanoid()} fileContent={"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laborum provident cupiditate officia enim assumenda perspiciatis, delectus sit, explicabo itaque voluptate asperiores ex totam dolor aspernatur aperiam recusandae quo expedita nam. \n delectus sit, explicabo itaque voluptate asperiores ex totam dolor aspernatur aperiam recusandae quo expedita nam."}/>])

          break

      case "cd":
          if(!arg) {
            setOutputs(prevState => [...prevState,
              <EchoCmd key={nanoid()} cmd={cmd}/>])
          }
          break

      case "edit":
          if(!arg) {
              console.log("no arg")
              setOutputs(prevState => [...prevState,
                <EchoCmd key={nanoid()} cmd={cmd}/>,
                <InvalidOutputMsg key={nanoid()} cmd={cmd} msg={"No such file or directory"} />])
          }
          break 

      default:
        setOutputs(prevState => [...prevState,
          <EchoCmd key={nanoid()} cmd={cmd}/>,
          <InvalidOutput key={nanoid()} cmd={cmd} />])
    }

  }
  
  // let cmd = []
   const cmd = userCommand?.split('').map((c, index )=> 
  index === cursorIdx ?
      <span key={nanoid()} className="cmd-cursor cmd-blink">
      <span data-text="" className="end">
        <span style={{whiteSpace: 'pre'}}>{c}<span></span></span>
      </span>
    </span>
  : <span key={nanoid()}  style={{whiteSpace: 'pre'}}>{c}</span>)

  console.log(cursorIdx)
  if (cursorIdx === userCommand.length || userCommand === "") {
    cmd.push(
      <span className="cmd-cursor cmd-blink">
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
            {/* <span data-text={cmdPromt}> */}
            <span className='cmd-prompt'>{cmdPromt}</span>
            {/* </span> */}
          </span>
          <div className="cmd-cursor-line" role="presentation" aria-hidden="true">
            {/* <span>{cmdBeforeCursor}</span> */}
            {cmd}
            {/* cursor goes here */}
            {/* <span>{cmdAfterCursor}</span> */}
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

export default App

/*
   {/* <div className='cmd'>
      <textarea className='user-command' 
                name="user-command" 
                id="user-command"
                value={userCommand}
                onKeyDown={handleKeyDown}
                onChange={handleChange}
                ref={inputReference}
                autoFocus
                />
      <b className="cmd-cursor cmd-blink" id="cursor">&nbsp;</b> */

