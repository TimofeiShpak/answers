import { observer } from "mobx-react";
import store from './store';

const Question = observer((props) => {
  let data = props.data[1];
  let id = props.data[0];
  let type = data.rightAnswer.length === 1 ? 'radio' : 'checkbox';

  return (
    <form data-id={id}>
    <p>{ `${props.index + 1}. ${data.question}` }</p>
    {store.isCheck && 
      (
        !data.isRight ? (
          <div className="wrong">
            Ошибка! Правильный ответ: 
            {[...data.rightAnswer].map((answer) => <p key={answer}>{answer}</p>)} 
          </div>
        ) : (
          <p className="right">Правильно!</p>
        )
      )
    }
    <div>
      {
        data.answers.map((answer) => {
          return (
            <div className="text_left" key={answer} data-id={id}>
              <input type={type} name={id} value={answer} id={answer+id} />
              <label htmlFor={answer+id}>{answer}</label>
            </div>
          )
        })
      }
    </div>
  </form>
  )
});

export default Question;