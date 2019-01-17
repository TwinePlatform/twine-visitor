import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Activities from './pages/Activities';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ConfirmPassword from './pages/ConfirmPassword';
import Visitor from './pages/Visitor';
import VisitorDetails from './pages/VisitorDetails';
import VisitsData from './pages/VisitsData';
import Settings from './pages/Settings';
import Feedback from './pages/Feedback';
import NotFound from '../shared/components/NotFound';


export default () => (
  <Switch>
    <Route exact path="/cb/password/reset/:token" component={ResetPassword} />
    <Route exact path="/cb/password/forgot" component={ForgotPassword} />
    <Route exact path="/cb/login" component={Login} />
    <Route exact path="/cb/confirm" component={ConfirmPassword} />
    <Route exact path="/cb/dashboard" component={Dashboard} />
    <Route exact path="/cb/activities" component={Activities} />
    <Route exact path="/cb/visitors" component={VisitorDetails} />
    <Route exact path="/cb/visits" component={VisitsData} />
    <Route exact path="/cb/visitors/:id" component={Visitor} />
    <Route exact path="/cb/settings" component={Settings} />
    <Route exact path="/cb/feedback" component={Feedback} />
    <Route component={NotFound} />
  </Switch>
);
