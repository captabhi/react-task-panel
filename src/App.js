import React from 'react';
import 'fontsource-roboto';
import './App.css';
import Grid from "@material-ui/core/Grid";
import Home from "./dashboard/Home";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import ViewByPriority from "./task-view/ViewByPriority";
import {DndProvider, useDrop} from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

function App() {
  return (

      <Router>
          <Switch>
              <Route path="/priority-view">
                  <DndProvider backend={HTML5Backend}>
                      <ViewByPriority/>
                  </DndProvider>
              </Route>
              <Route path="/">
                  <Grid container>
                      <Grid item xs={12}>
                          <Home/>
                      </Grid>
                  </Grid>
              </Route>
          </Switch>
    </Router>
  );
}

export default App;
