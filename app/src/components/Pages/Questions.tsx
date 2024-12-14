import { observer } from "mobx-react";
import Time from "../time";
import QuestionList from '../QuestionList';
import Results from '../Results';
import store from "src/store/store";
import { Link } from "react-router-dom";

const Questions = observer(() => {
  let { exit, changeMode, isCheck } = store;

  return (
    <div className="questions">
      <header>
        <Time />
      </header>
      <QuestionList />
      <footer>
        <button onClick={changeMode} className="btn-finish">
          { !isCheck ? 'Закончить попытку' : 'Начать заново'} 
        </button>
        <Link to="/tests"><button onClick={exit}>Выйти</button></Link>
        <Results />
      </footer>
    </div>
  )
})

export default Questions;
