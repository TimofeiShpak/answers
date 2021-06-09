import { observer } from 'mobx-react';
import './App.css';
import QuestionList from './QuestionList';
import store from './store';

const App = observer(() => {
  return (
    <div className="App">
      <QuestionList />
      <button onClick={store.changeMode}>
        { !store.isCheck ? 'Закончить попытку' : 'Начать заново'} 
      </button>
      {store.isCheck && 
        <p>Ваши баллы: {`${store.score} : ${Object.keys(store.questions).length}`} </p>
      }
    </div>
  );
})

export default App;
