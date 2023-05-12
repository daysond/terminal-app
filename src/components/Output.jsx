import { nanoid } from "nanoid"
const cmdPromt = "foobar:~/sess$ "

export const WelcomeBanner = () => {
    const banner = `
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

    const elements = banner.split('\n').map(e=> <p key={nanoid()} style={{ whiteSpace: 'pre', color: 'red' }}>{e}</p>)
    
    return (
        <div style={{width: '100%'}}>
        {elements}
        <br />
        </div>
            )
}

export const EchoCmd = ({cmd}) => {

    return (
        <div style={{width: '100%'}}>
            <span className='cmd-prompt'>{cmdPromt}</span>
            <span className="">{cmd}</span>
        </div>
    )
}

export const InvalidOutput = ({cmd}) => {
    return (
    <div style={{width: '100%'}}>
        <span>{`${cmd}: command not found.  Type `}</span>
        <span className="term-orange">help</span>
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

export const LsOutput = ({contents}) => {

    const fileElements = contents.map(element =>
        <span key={nanoid()} className={element.isFolder ? "term-yellow block-span" : "block-span"}>{element.name}</span>
    )

    return (
        <div style={{width: '100%'}}>
        {fileElements}
        <br />
        </div>
    )
}

export const CatOutput = ({fileContent}) => {

    const pElements = fileContent.split("\n").map(p =>
        <p key={nanoid()} className="terminal-p" >{p}</p>
    )

    return (
        <div style={{width: '100%'}}>
        <br />
        {pElements}
        <br />
        </div>
    )
}

// export const InvalidOutput = ({cmd}) => {

//     return (
        
//     )

// }