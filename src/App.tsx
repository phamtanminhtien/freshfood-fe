import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "./containers/Home";
import Login from "./containers/Login";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/home">
          <Home />
        </Route>

        <Route exact path="">
          <Login />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
