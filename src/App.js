import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/home";
import AddImages from "./components/AddImages";
import "./App.css";

function App() {
  return (
    <>
      <Navbar />
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/album/:albumId" component={AddImages} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
