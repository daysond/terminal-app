import { nanoid } from "nanoid";

export const Progress = ({ user }) => {
  console.log("progress: ", user);
  const { status, level, question, totalLevelQuestions } = user;
  console.log("total: ", totalLevelQuestions);

  if (status !== "passed" && status !== "started" && status !== "submitted") {
    let element = null;
    switch (status) {
      case "new":
        element = (
          <span className="command">You've not yet solved a challenge.</span>
        );
        break;
      case "completed":
        element = (
          <span className="term-green">You've completed all the levels!</span>
        );
        break;
      case "timeout":
        element = (
          <span className="term-warning">
            You didn't complete the challenge in time. Good luck next time!
          </span>
        );
        break;
      default:
        break;
    }
    return (
      <div className="cmd-group">
        <p> {element} </p>
      </div>
    );
  }

  // if (status === "completed") {
  //   return (
  //     <div className="cmd-group">
  //       <p>
  //         {" "}
  //         <span className="command">Congratulations! </span>{" "}
  //         <span className="term-green">You've completed all the levels!</span>{" "}
  //       </p>
  //       <br />
  //       <ProgressBar
  //         level={level+1}
  //         questionLeft={0}
  //         totalLevelQuestions={totalLevelQuestions}
  //       />
  //     </div>
  //   );
  // }

  if (status === "passed" && question === 1) {
    // Finished previous level, havent started the next one yet
    return (
      <div className="cmd-group">
        <p>Level {level - 1} complete </p>
        <p>You are now on level {level} </p>
        <p>Challenge left to complete level: {totalLevelQuestions} </p>
        <br />
        <ProgressBar
          level={level}
          questionLeft={totalLevelQuestions}
          totalLevelQuestions={totalLevelQuestions}
        />
        <p>
          Type <span className="command">request</span> to request a new
          challenge now, or come back later.
        </p>
      </div>
    );
  }

  // Submited: level in progress, one or more questions have been submited but hasn't started the next level
  const questionLeft =
    status === "submitted" || "started"
      ? totalLevelQuestions - question + 1
      : totalLevelQuestions - question;

  if (status === "started" || status === "submitted") {
    return (
      <div className="cmd-group">
        <p>Current level: {level} </p>
        <p>Challenge left to complete: {questionLeft} </p>
        <br />
        <ProgressBar
          level={level}
          questionLeft={questionLeft}
          totalLevelQuestions={totalLevelQuestions}
        />
      </div>
    );
  }
};

const ProgressBar = ({ level, questionLeft, totalLevelQuestions }) => {
  const style = {
    width: "4ch",
    display: "inline-block",
    textAlign: "right",
  };
  const maxbar = 42;
  const elements = [];
  for (let i = 1; i < 6; i++) {
    if (i === level) {
      const progress = parseInt((1 - questionLeft / totalLevelQuestions) * 100);
      console.log("progress: ", progress);
      const remainBar = parseInt((maxbar * questionLeft) / totalLevelQuestions);
      elements.push(
        <p>
          <span key={nanoid()}>
            {`Level ${i}: `} <span style={style}>{`${progress}%`}</span>
            {`[${"=".repeat(maxbar - remainBar)}${".".repeat(remainBar)}]`}
          </span>
        </p>
      );
    } else {
      elements.push(
        <p>
          <span key={nanoid()} className={i < level ? "term-green" : ""}>
            {`Level ${i}: `}{" "}
            <span style={style}>{i < level ? "100%" : "0%"}</span>
            {i < level ? `[${"=".repeat(maxbar)}]` : `[${".".repeat(maxbar)}]`}
          </span>
        </p>
      );
    }
  }

  return (
    <div className="cmd-group" style={{ color: "white" }}>
      {elements}
    </div>
  );
};
