import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./components/Login";
import Header from "./components/Header";
import "./App.css";
import Home from "./components/Home";
import Detail from "./components/Detail";
import Watchlist from "./components/Watchlist";
import Search from "./components/Search";
import Category from "./components/Category";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/home" component={Home} />
          <Route path="/detail/:id" component={Detail} />
          <Route path="/watchlist" component={Watchlist} />
          <Route path="/search" component={Search} />
          <Route path="/category/:id" component={Category} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;