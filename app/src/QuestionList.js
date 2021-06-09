import { observer } from "mobx-react";
import Question from "./Question";
import store from "./store";

const QuestionList = observer(() => {
  let questions = store.shuffleQuestions;
  return (
    <div onClick={store.selectAnswer}>
      {
        questions.map((data, index) => {
          return <Question data={data} key={data[0]} index={index} />
        })
      }
    </div>
  )
});

export default QuestionList;