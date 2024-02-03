import { observer } from "mobx-react";
import store from "../store/store";

const Results = observer(() => {
  let { isCheck, isShowResults, score, numberQuestions, scrollToAnswer, links, changeVisibleResults } = store;

  return (
    <div>
      { isCheck &&
        <div>
          <button onClick={changeVisibleResults}>
            { isShowResults ? 'Скрыть неправильные ответы' : 'Показать неправильные ответы' }
          </button>
          { isShowResults &&
            <div>
              <p>Ваши баллы: {`${score} : ${numberQuestions}`}</p>
              <span>Процент правильных ответов {`${(score/numberQuestions * 100).toFixed(1)}`}%</span>
              <div className="wrong-results" onClick={scrollToAnswer}>
                <div>Неправильные ответы: </div>
                { links.map((link) => {
                  return <span className="result" key={link.id} data-id={link.id}>{ link.index }</span>
                })}
              </div>
            </div>
          }
        </div>
      }
    </div>
  )
});

export default Results;