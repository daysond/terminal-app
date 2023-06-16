import { nanoid } from "nanoid"

export const WelcomeBanner = () => {
    let banner = `
                                                                                    \n
    SSSSSSSSSSSSSSS EEEEEEEEEEEEEEEEEEEEEE   SSSSSSSSSSSSSSS    SSSSSSSSSSSSSSS     \n
    SS:::::::::::::::SE::::::::::::::::::::E SS:::::::::::::::S SS:::::::::::::::S  \n
   S:::::SSSSSS::::::SE::::::::::::::::::::ES:::::SSSSSS::::::SS:::::SSSSSS::::::S  \n
   S:::::S     SSSSSSSEE::::::EEEEEEEEE::::ES:::::S     SSSSSSSS:::::S     SSSSSSS  \n
   S:::::S              E:::::E       EEEEEES:::::S            S:::::S              \n
   S:::::S              E:::::E             S:::::S            S:::::S              \n
    S::::SSSS           E::::::EEEEEEEEEE    S::::SSSS          S::::SSSS           \n
     SS::::::SSSSS      E:::::::::::::::E     SS::::::SSSSS      SS::::::SSSSS      \n
       SSS::::::::SS    E:::::::::::::::E       SSS::::::::SS      SSS::::::::SS    \n
          SSSSSS::::S   E::::::EEEEEEEEEE          SSSSSS::::S        SSSSSS::::S   \n
               S:::::S  E:::::E                         S:::::S            S:::::S  \n
               S:::::S  E:::::E       EEEEEE            S:::::S            S:::::S  \n
   SSSSSSS     S:::::SEE::::::EEEEEEEE:::::ESSSSSSS     S:::::SSSSSSSS     S:::::S  \n
   S::::::SSSSSS:::::SE::::::::::::::::::::ES::::::SSSSSS:::::SS::::::SSSSSS:::::S  \n
   S:::::::::::::::SS E::::::::::::::::::::ES:::::::::::::::SS S:::::::::::::::SS   \n
    SSSSSSSSSSSSSSS   EEEEEEEEEEEEEEEEEEEEEE SSSSSSSSSSSSSSS    SSSSSSSSSSSSSSS     \n
    `

    banner = `                                                          
    .oooooo..o    oooooooooooo     .oooooo..o     .oooooo..o            
    d8P\'    \`Y8    \`888\'     \`8    d8P'    \`Y8    d8P\'    \`Y8           
    Y88bo.          888            Y88bo.         Y88bo.                
     \`\"Y8888o.      888oooo8        \`\"Y8888o.      \`\"Y8888o.            
         \`\"Y88b     888    \"            \`\"Y88b         \`\"Y88b           
    oo     .d8P     888       o    oo     .d8P    oo     .d8P           
    8\"\"88888P'     o888ooooood8    8\"\"88888P'     8\"\"88888P\'            
    `

    const elements = banner.split('\n').map(e=> <p key={nanoid()} style={{ whiteSpace: 'pre', color: 'red' }}>{e}</p>)
    
    return (
        <div style={{width: '100%'}}>
        {elements}
        <br />
        </div>
            )
}

export const EchoCmd = ({cmdPrompt, cmd}) => {

    const cmdPromptStyle = {
        width:`${cmdPrompt?.length}ch`
    }

    return (
        <div style={{width: '100%'}}>
            <span className='cmd-prompt' style={cmdPromptStyle}>{cmdPrompt}</span>
            <span className="">{cmd}</span>
        </div>
    )
}

export const InvalidOutput = ({cmd}) => {
    return (
    <div style={{width: '100%'}}>
        <span>{`${cmd}: command not found.  Type `}</span>
        <span className="command">help</span>
        <span> {" for a list of commands"}</span>
    </div>
    )
}

export const InvalidOutputMsg = ({cmd, msg}) => {
    return (
    <div style={{width: '100%'}}>
        <span>{`${cmd}: ${msg}`}</span>
    </div>
    )
}

export const Message = ({msg}) => {
    return (
    <div style={{width: '100%'}}>
        <span>{`${msg}`}</span>
    </div>
    )
}

export const LsOutput = ({contents}) => {

    const fileElements = contents?.map(element =>
        <span key={nanoid()} className={element.isFolder ? "term-blue block-span" : "block-span"}>{element.name}</span>
    )

    return (
        <div style={{width: '100%'}}>
        {fileElements}
        </div>
    )
}

export const CatOutput = ({fileContent}) => {

    const pElements = fileContent.split("\n").map(p =>
        <p key={nanoid()} className="terminal-p" >{p}</p>
    )
    return (
        <div style={{width: '100%', whiteSpace: 'pre-wrap'}}>
        <br />
        <p key={nanoid()} className="terminal-p" >{fileContent}</p>
        <br />
        </div>
    )
    // return (
    //     <div style={{width: '100%', whiteSpace: 'pre'}}>
    //     <br />
    //     {pElements}
    //     <br />
    //     </div>
    // )
}

// export const InvalidOutput = ({cmd}) => {

//     return (
        
//     )

// }