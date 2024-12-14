import { observer } from "mobx-react";
import store from "src/store/store";
import { Link } from "react-router-dom";
import AnswerItem from "../AnswerItem";

const Answers = observer(() => {
  let { exit, showQuestions, getId, options, changeOption, searchText, changeSearchText,
    testName } = store;
  let dataOptions = Object.entries(options);

  return (
    <div className="answers">
      <header className="answers__header">
        <div className="answers__menu">
          <div>Вопросы и ответы</div>
          <Link to="/tests"><button onClick={exit}>Выйти</button></Link>
          <input 
            className="answers__input"
            type="text" 
            placeholder="Введите слова для поиска" 
            value={searchText} 
            onChange={changeSearchText}/>
        </div>
        <div>{testName}</div>
        <form className="options">
          <p className="options__description">Выберите элементы которые хотите показать: </p>
          {
            dataOptions.map((option) => {
              let onChange = () => changeOption(option[0], !option[1].value);
              return (
                <div key={option[0]}>
                  <input type='checkbox' name={option[0]} id={option[0]} checked={option[1].value} onChange={onChange}/>
                  <label htmlFor={option[0]}>{option[1].title}</label>
                </div>
              )
            })
          }
        </form>
      </header>
      <div className="question-answers-list">
        { showQuestions.length > 0 ? (
            showQuestions.map((data, index) => {
              return <AnswerItem data={data[1]} key={getId()} index={index}/>
            })
          ) : (
            <div>Ничего не найдено</div>
          )
        }
      </div>
    </div>
  )
})

export default Answers;
