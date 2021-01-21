import React from 'react';
import ReactDOM from 'react-dom';
import {Switch, Route, BrowserRouter} from 'react-router-dom';
import './index.css';
import Recents from './Recents';
import Space from './Space';
import Webex from './Webex';

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      {/* <Route path="/" component={Recents}></Route> */}
      {/* <Route path="/" component={Space}></Route> */}
      <Route path="/" component={Webex}></Route>
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
);