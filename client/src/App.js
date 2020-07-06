import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import withContext from './Context';
import PrivateRoute from './PrivateRoute';

import Header from './components/Header';
import UserSignIn from  './components/UserSignIn';
import NotFound from './components/NotFound';
import UserSignUp from './components/UserSignUp';
import UserSignOut from './components/UserSignOut';
import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';
import Authenticated from './components/Authenticated';

const HeaderWithContext = withContext(Header);
const AuthWithContext = withContext(Authenticated);
const UserSignInWithContext = withContext(UserSignIn);
const UserSignOutWithContext = withContext(UserSignOut);
const UserSignUpWithContext = withContext(UserSignUp);

export default () => (
  <Router>
    <div>
      <HeaderWithContext />
      <Switch>
        <Route exact path="/" component={Courses} />
        <PrivateRoute path="/authenticated" component={AuthWithContext} />
        <Route path="/signin" component={UserSignInWithContext} />
        <Route path="/signup" component={UserSignUpWithContext}/>
        <Route path="/signout" component={UserSignOutWithContext} />
        <Route path="/courses/:id" component={CourseDetail} />
        <Route component={NotFound} />
      </Switch>
    </div>
  </Router>
);



