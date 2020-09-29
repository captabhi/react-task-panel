import React from 'react';
import 'fontsource-roboto';
import './App.css';
import Grid from "@material-ui/core/Grid";
import Home from "./dashboard/Home";

function App() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <Home/>
      </Grid>
    </Grid>
  );
}

export default App;
