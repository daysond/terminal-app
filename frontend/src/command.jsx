export const help = [
  <div className="cmd-group" key="help-cmd-group">
    <span className="command cmd-width">clear</span> - Clear console
    <br />
    <span className="command cmd-width">ls</span> - List directory contents
    <br />
    <span className="command cmd-width">cd</span> - Change directory [dir_name]
    <br />
    <span className="command cmd-width">cat</span> - Print file [file_name]
    <br />
    <span className="command cmd-width">edit</span> - Open file in the editor
    [file_name]
    <br />
    <span className="command cmd-width">request</span> - Request challenge
    <br />
    <span className="command cmd-width">status</span> - print progress
    <br />
    <span className="command cmd-width">submit</span> - Submit final solution
    for accessment [file_name]
    <br />
    <span className="command cmd-width">verify</span> - Run tests on solution
    file [file_name]
    <br />
    <span className="command cmd-width">logout</span> - Log out
    <br />
  </div>,
];

export const start = (
  <div className="cmd-group">
    <p>
      Type <span className="command">request</span> to request a challenge.
    </p>
    <p>
      Type <span className="command">help</span> for a list of commands.
    </p>
  </div>
);

export const verifyCode = `<p> Type  <span class="command">request</span>  to request a challenge.</p>`;

export const MountingPrompt = ({ username }) => {
  return (
    <div className="cmd-group">
      <p>
        Mounting <span className="command">/home/{username}...</span>
      </p>
      <p>
        <span className="term-redorange">
          Welcome to SESS Foobar Challenge 2023.
        </span>
      </p>
    </div>
  );
};

export const HighlightedText = ({ text }) => {
  return (
    <div>
      <p className="highlight-text-block">{text}</p>
    </div>
  );
};

export const NewChallengeInfo = ({ name, timeLimit }) => {
  return (
    <div className="cmd-group">
      <p>
        New challenge <span className="command">"{name}"</span> added to your
        home folder.
      </p>
      <p>
        Time to solve: <span className="command">{` ${timeLimit} `}</span>{" "}
        hours.
      </p>
    </div>
  );
};

export const RequestWarning = () => {
  return (
    <div className="cmd-group">
      <p>
        <span className="term-warning">
          You are about to begin a TIME-LIMITED challenge. You will have 7 days
          to complete each newly requested challenge or LOSE ACCESS to this
          site.
        </span>
      </p>
      <p>
        <span className="term-gold">
          Do you wish to proceed and start the timer on your first challenge?
        </span>
      </p>
    </div>
  );
};

export const SubmissionWarning = () => {
  return (
    <div className="cmd-group">
      <p>
        <span className="term-warning">
          Are you sure you want to submit your solution?
        </span>
      </p>
    </div>
  );
};

export const AllTestPassed = () => {
  return (
    <div className="cmd-group">
      <p>
        <span className="term-green">All test cases passed.</span> Use{" "}
        <span className="command">submit solution.py</span> to submit your
        solution.
      </p>
    </div>
  );
};

export const TestCaseResult = (results) => {

  const resultElement = Object.values(results)[0].map(r=> 
    <p key={r.test}> 
      <span className={ r.result === 'passed' ? "term-green" : "term-warning"}>
        {r.test}: {r.result}
        </span>
    </p>)

  return (
    <div className="cmd-group">
     {resultElement}
    </div>
  );
}