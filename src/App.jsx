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
  const [logs, setLogs] = useState([])
  
  // Handle user command
  const handleChange = (event) => {
    setUserCommand(event.target.value.replace(/\r?\n|\r/g, ""))
    // console.log(event.target.value)
  }

  const handleKeyDown = (event) => {
    console.log(event.key)
    if(event.key === 'Enter') {
      //TODO: FIRE COMMAND
      response()
      setUserCommand("")
    }

    if(event.key === 'ArrowUp') {
      console.log("upppp")
    }

    if(event.key === 'ArrowDown') {
      console.log("down....")
    }

    if(event.key === 'Tab') {
      console.log('tab')
    }


  }

  useEffect(()=>{
    setLogs([<WelcomeBanner key={nanoid()} />])
    inputReference.current.focus()
  }, [])

  const focusTextArea = () => {
    console.log("clicked")
    inputReference.current.focus()
  }

  // Response to user command
  const response = () => {
    const inputs = userCommand.split(" ")
    const cmd = inputs[0]
    const arg = inputs[1]

    switch (cmd) {
      case "clear":
        setLogs([])
        break
      
      case "help":
        setLogs(prevState => [...prevState,
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

        setLogs(prevState => [...prevState,
          <EchoCmd key={nanoid()} cmd={cmd}/>,
          <LsOutput key={nanoid()} contents={contents} />])
        
        break
      
      case "request":
        break

      case "cat":
        setLogs(prevState => [...prevState,
          <EchoCmd key={nanoid()} cmd={cmd}/>,
          <CatOutput key={nanoid()} content={"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laborum provident cupiditate officia enim assumenda perspiciatis, delectus sit, explicabo itaque voluptate asperiores ex totam dolor aspernatur aperiam recusandae quo expedita nam. \n delectus sit, explicabo itaque voluptate asperiores ex totam dolor aspernatur aperiam recusandae quo expedita nam."}/>])

          break

      case "cd":
          if(!arg) {
            setLogs(prevState => [...prevState,
              <EchoCmd key={nanoid()} cmd={cmd}/>])
          }
          break

      case "edit":
          if(!arg) {
              console.log("no arg")
              setLogs(prevState => [...prevState,
                <EchoCmd key={nanoid()} cmd={cmd}/>,
                <InvalidOutputMsg key={nanoid()} cmd={cmd} msg={"No such file or directory"} />])
          }
          break 

      default:
        setLogs(prevState => [...prevState,
          <EchoCmd key={nanoid()} cmd={cmd}/>,
          <InvalidOutput key={nanoid()} cmd={cmd} />])
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

