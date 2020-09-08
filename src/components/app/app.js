import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <>
    <Router>

      
      {/* Here is the main routing mechanism */}
      <Switch>          
        <Route path="/announcement-boards">
          <div>Render announcement boards component!</div>
        </Route>

        <Route path="/menu">
          <div>Render the menu component!</div>
        </Route>

        <Route path="/events">
          <div>Render the events section!</div>
        </Route>

        <Route path="/map">
          <div>Render the map component!</div>
        </Route>

        <Route path="/">
          <div>Error component</div>
        </Route>
      </Switch>
    </Router>      
    </>
  );
}

export default App;
