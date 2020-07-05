import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import Header from './components/Header';
import UserSignIn from  './components/UserSignIn';
import NotFound from './components/NotFound';
import UserSignUp from './components/UserSignUp';
import UserSignOut from './components/UserSignOut';
import Courses from './components/Courses';

export default () => (
  <Router>
    <div>
      <Header />
      <Switch>
        <Route exact path="/" component={Courses} />
        <Route path="/authenticated" component={NotFound} />
        <Route path="/signin" component={UserSignIn} />
        <Route path="/signup" component={UserSignUp}/>
        <Route path="/signout" component={UserSignOut} />
        <Route component={NotFound} />
      </Switch>
    </div>
  </Router>
)



