import { observer } from 'mobx-react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Home from './Pages/Home';
import Questions from './Pages/Questions';
import Answers from './Pages/Answers';

const App = observer(() => {
  return (
    <div>
      <Router>
        <Redirect to="/tests" />
          <div className="App">
            <Switch>
              <Route path="/questions">
              <Questions />
              </Route>
              <Route path="/answers">
                <Answers />
              </Route>
              <Route path="/tests">
                <Home />
              </Route>
            </Switch>
          </div>
        </Router>
    </div>);
})

export default App;
