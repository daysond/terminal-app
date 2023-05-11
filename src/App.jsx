import { useEffect, useRef, useState } from 'react'
import './App.css'
import { nanoid } from 'nanoid'
import { help } from './command'
import { Output } from './components/Output'

function App() {
  
  const cmdPromt = "foobar:~/sess$ "
  const inputReference = useRef(null)
  const [userCommand, setUserCommand] = useState("")
  const [logs, setLogs] = useState([])
  
  // Handle user command
  const handleChange = (event) => {
    setUserCommand(event.target.value)
    // console.log(event.target.value)
  }

  const handleKeyDown = (event) => {
    // console.log(event.key)
    if(event.key === 'Enter') {
      //TODO: FIRE COMMAND
      response()
      
      setUserCommand("")
      
    }
  }

  useEffect(()=>{
    inputReference.current.focus()
  }, [])

  const focusTextArea = () => {
    console.log("clicked")
    inputReference.current.focus()
  }

  // Response to user command
  const response = () => {
    const cmd = userCommand.replace(/\r?\n|\r/g, "")

    switch (cmd) {
      case "clear":
        setLogs([])
        break
      
      case "help":
        setLogs(prevState => [...prevState,
        <Output key={nanoid()} cmd={cmd}/>, ...help])
        break
        
      default:
        setLogs(prevState => [...prevState,
          <Output key={nanoid()} cmd={cmd}/>,
          <Output key={nanoid()} cmd={cmd} valid={false} />])
    }

  }
  


  const cmd = userCommand.split('').map(c => <span key={nanoid()}>{c}</span> )

  return (
    <main className='console active terminal' onClick={focusTextArea}>
    <div className='terminal-wrapper' >
      <div className='terminal-output' >
      {logs}
      </div>
      <div className="cmd enabled">
        <div className="cmd-wrapper">
          <span className="cmd-prompt">
            {/* <span data-text={cmdPromt}> */}
            <span className='cmd-prompt'>{cmdPromt}</span>
            {/* </span> */}
          </span>
          <div className="cmd-cursor-line" role="presentation" aria-hidden="true">
            <span>{cmd}</span>
            <span className="cmd-cursor cmd-blink">
              <span data-text="" className="end">
                <span>&nbsp;<span></span></span>
              </span>
            </span>
          </div>
      </div>
      <textarea 
      autoCapitalize="off" 
      spellCheck="false" 
      tabIndex="1" 
      className="cmd-clipboard" 
      data-cmd-prompt="foobar:~/sess$ " 
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

