import { observer } from 'mobx-react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Home from './Pages/Home';
import Questions from './Pages/Questions';
import Answers from './Pages/Answers';
import { devices } from '../store/constants';

interface AppProps {
  uid: string, 
}

const App = observer((props: AppProps) => {
  return (
    <div>
      { devices.includes(props.uid) ?
        (<Router>
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
          </Router>) : (
          <div>{ props.uid }</div>
        )
      }
    </div>);
})

export default App;
