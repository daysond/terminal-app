const cmdPromt = "foobar:~/sess$ "

export const Output = ({cmd, valid=true}) => {

    return (
        valid ?
        <div style={{width: '100%'}}>
            <span className='cmd-prompt'>{cmdPromt}</span>
            <span>{cmd}</span>
        </div> : 
        <div style={{width: '100%'}}>
            <span>{`${cmd}: command not found.  Type `}</span>
            <span className="term-orange">help</span>
            <span> {" for a list of commands"}</span>
        </div>

    )
}

// export const InvalidOutput = ({cmd}) => {

//     return (
        
//     )

// }