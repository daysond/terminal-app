

export const help = [
    <div className="cmd-group" key="help-cmd-group">
      <span className="command cmd-width">clear</span>      - Clear console
      <br />
      <span className="command cmd-width">ls</span>         - List directory contents
      <br />
      <span className="command cmd-width">cd</span>         - Change directory [dir_name]
      <br />
      <span className="command cmd-width">cat</span>        - Print file [file_name]
      <br />
      <span className="command cmd-width">edit</span>       - Open file in the editor [file_name]
      <br />
      <span className="command cmd-width">request</span>    - Request challenge
      <br />
      <span className="command cmd-width">status</span>     - print progress
      <br />
      <span className="command cmd-width">submit</span>     - Submit final solution for accessment [file_name]
      <br />
      <span className="command cmd-width">verify</span>     - Run tests on solution file [file_name]
      <br />
      <span className="command cmd-width">logout</span>     - Log out
      <br />
    </div>
  ]

  export const start = (
    <div className="cmd-group">
      <p> Type  <span className="command">request</span>  to request a challenge.</p>
      <p> Type <span className="command">help</span> for a list of commands.</p>
    </div>
  )

//  export const invalid = 