import { observer } from 'mobx-react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import QuestionList from './QuestionList';
import Results from './Results';
import store from '../store/store';
import Time from './time';

const App = observer(() => {
  let { changeNumberQuestions, numberQuestions, exit, changeMode, isCheck, start } = store;

  return (
    <Router>
      <Redirect to="/" />
      <div className="App">
        <Switch>
          <Route path="/questions">
            <header>
              <Time />
            </header>
            <QuestionList />
            <footer>
              <button onClick={changeMode} className="btn-finish">
                { !isCheck ? 'Закончить попытку' : 'Начать заново'} 
              </button>
              <Link to="/"><button onClick={exit}>Выйти</button></Link>
              <Results />
            </footer>
          </Route>
          <Route path="/">
            <div className="start-page">
              <Link to="/questions"><button onClick={start}>Начать тестирование</button></Link>
              <div>
                <input 
                  type="number" 
                  min="1" 
                  max="64" 
                  id="number"
                  onChange={changeNumberQuestions} 
                  value={numberQuestions}
                />
                <label htmlFor="number">Выберите количество вопросов</label>
              </div>
            </div>
          </Route>
        </Switch>
      </div>
    </Router>
  );
})

export default App;
