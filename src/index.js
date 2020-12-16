import React from 'react';
import ReactDOM from 'react-dom';
import {Switch, Route, BrowserRouter} from 'react-router-dom';
import './index.css';
import Recents from './Recents';
import Space from './Space';

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/" component={Recents}></Route>
      {/* <Route path="/" component={Space}></Route> */}
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
);