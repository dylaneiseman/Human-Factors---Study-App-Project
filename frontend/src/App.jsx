import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import HomePage from './components/HomePage';
import NotFound from './components/NotFound';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/login" component={Login} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
