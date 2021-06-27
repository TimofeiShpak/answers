import classNames from "classnames";
import { observer } from "mobx-react";
import store from "src/store/store";

const AnswerItem = observer((props) => {
  let { question, answers, rightAnswer } = props.data;
  let { getData } = store;
  answers = getData(answers, rightAnswer);

  return (
    <div className="question">
      <p>{props.index+1}.{ question }</p>
      <ul>
        { answers.map((answer) => {
            let className = classNames({
              "answer": true,
              "right-answer": rightAnswer.includes(answer)
            });
            return <li className={className} key={answer}>{ answer }</li>
          })
        }
      </ul>
    </div>
  )
});

export default AnswerItem;