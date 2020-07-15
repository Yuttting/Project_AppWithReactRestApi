import React from 'react';
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
import CreateCourse from './components/CreateCourse';
import UpdateCourse from './components/UpdateCourse';
import UnhandledError from './components/UnhandledError';
import Forbidden from './components/Forbidden';

const HeaderWithContext = withContext(Header);
const AuthWithContext = withContext(Authenticated);
const UserSignInWithContext = withContext(UserSignIn);
const UserSignOutWithContext = withContext(UserSignOut);
const UserSignUpWithContext = withContext(UserSignUp);
const CreateCourseWithContext = withContext(CreateCourse);
const UpdateCourseWithContext = withContext(UpdateCourse);
const CoursesWithContext = withContext(Courses)
const CourseDetailWithContext = withContext(CourseDetail);

export default () => (
  <Router>
    <div>
      <HeaderWithContext />
      <Switch>
        <Route exact path="/" component={CoursesWithContext} />
        <PrivateRoute path="/authenticated" component={AuthWithContext} />
        <Route path="/signin" component={UserSignInWithContext} />
        <Route path="/signup" component={UserSignUpWithContext}/>
        <Route path="/signout" component={UserSignOutWithContext} />
        <Route exact path="/courses/:id" component={CourseDetailWithContext} />
        <PrivateRoute path="/create-course" component={CreateCourseWithContext} />
        <PrivateRoute path="/courses/:id/update-course" component={UpdateCourseWithContext} />
        <Route path="/error" component={UnhandledError} />
        <Route path="/forbidden" component={Forbidden} />
        <Route component={NotFound} />
      </Switch>
    </div>
  </Router>
);



