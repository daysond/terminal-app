import { nanoid } from "nanoid";

export const Progress = ({ user }) => {
  console.log("progress: ", user);
  const { status, level, question, totalLevelQuestions } = user;

  if (status === "new") {
    return (
      <div className="cmd-group">
        <p>
          <span className="command">You've not yet solved a challenge.</span>
        </p>
      </div>
    );
  }

  if (status === "passed" && question === 1) {
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

  const questionLeft =
    status === "passed"
      ? totalLevelQuestions - question
      : totalLevelQuestions - question + 1;

  if (status === "started" || (status === "passed" && question > 1)) {
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
    if (i < level) {
      elements.push(
        <p key={nanoid()} className="term-green">
          {`Level ${i}: `} <span style={style}>{`100%`}</span>
          {`[${"=".repeat(maxbar)}]`}
        </p>
      );
    } else {
      const progress = parseInt(1 - questionLeft / totalLevelQuestions) * 100;
      const remainBar = parseInt((maxbar * questionLeft) / totalLevelQuestions);
      elements.push(
        <p key={nanoid()}>
          {`Level ${i}: `} <span style={style}>{`${progress}%`}</span>
          {`[${"=".repeat(maxbar - remainBar)}${".".repeat(remainBar)}]`}
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
