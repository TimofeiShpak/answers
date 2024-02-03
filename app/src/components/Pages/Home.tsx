import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import store from "src/store/store";

const Home = observer(() => {
  let { changeNumberQuestions, numberQuestions, start, typeQuestions, changeTest, search, 
    maxNumberQuestions, inputNumberQuestionsValue, blurNumberQuestions } = store;
  let dataTypeQuestions = Object.entries(typeQuestions);

  return (
    <div className="start-page">
      <div className="name-tests">
        <form className="options">
          <p className="options__description">Выберите из тестов</p>
          {
            dataTypeQuestions.map((option) => {
              let onChange = () => changeTest(option[0], !option[1].value);
              return (
                <div key={option[0]}>
                  <input type='radio' name={option[0]} id={option[0]} checked={option[1].value} onChange={onChange}/>
                  <label htmlFor={option[0]}>{option[1].title}</label>
                </div>
              )
            })
          }
        </form>
      </div>
      <div>
        <Link to="/questions">
          <button onClick={start}>Начать тестирование</button>
        </Link>
        <Link to="/answers">
          <button>Посмотреть вопросы и ответы</button>
        </Link>
      </div>
      <div>
        <input 
          type="number" 
          min="1" 
          max={maxNumberQuestions} 
          id="number"
          onChange={changeNumberQuestions} 
          onBlur={blurNumberQuestions}
          value={inputNumberQuestionsValue}
        />
        <label htmlFor="number">Выберите количество вопросов</label>
      </div>
    </div>
  )
});

export default Home;