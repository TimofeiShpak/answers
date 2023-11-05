import { observer } from "mobx-react";
import store from '../store/store';

export interface Data {
  answers: [string],
  rightAnswer: [string],
  question: string,
  isRight?: boolean
}

interface QuestionProps {
  data: [string, Data],
  index: number,
}

const Question = observer((props: QuestionProps) => {
  let data = props.data[1];
  let id = props.data[0];
  let type = data.rightAnswer.length === 1 ? 'radio' :  'checkbox';
  let { isCheck, rightAnswers } = store;

  let checkIsCorrect = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    let clickElem = (event.target as HTMLElement);
    let textElem = clickElem.closest('.text_left');

    if (textElem) {
      let inputElem = textElem.querySelector('input');
      if (inputElem) {
        let correct = inputElem.dataset.correct;
        if (correct === "true") {
          textElem.classList.add('right');
        } else {
          textElem.classList.add('wrong');
        }
      }
    }
  }

  return (
    <form data-id={id} id={id} className="question">
    <p>{ `${props.index + 1}. ${data.question}` }</p>
    { isCheck ? (
        !rightAnswers[id] ? (
            <div className="wrong">
              Ошибка! Правильный ответ: 
              {[...data.rightAnswer].map((answer) => <p key={answer}>{answer}</p>)} 
            </div>
          ) : (
            <p className="right">Правильно!</p>
        )
      ) : (
        <div className="guess">
          <div className="guess__title">Подсказка</div>
          <div className="guess__answers">
            {[...data.rightAnswer].map((answer) => <p className="guess__text" key={answer}>{answer}</p>)} 
          </div>
        </div>
      )
    }
    <div>
      { data.answers.length > 0 ? ( 
          data.answers.map((answer) => {
            let correct = data.rightAnswer.includes(answer)
            return (
              <div className="text_left" key={answer} onClick={checkIsCorrect}>
                <input type={type} name={id} value={answer} id={answer+id} data-correct={correct} />
                <label htmlFor={answer+id}>{answer}</label>
              </div>
            )
          })
        ) : (
          <div className="text_left">
            <input type="text" name={id} autoComplete="off"/>
          </div>
        )
      }
    </div>
  </form>
  )
});

export default Question;