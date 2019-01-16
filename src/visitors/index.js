import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './pages/homeVisitor';
import Signup from './pages/Signup';
import Thanks from './pages/thanks';
import ThanksFeedback from './pages/thank_you_feedback';
import QrError from './pages/qrerror';
import Login from './pages/qrcode';
import redirectAfterTimeout from '../shared/components/hoc/redirect_after_timeout';
import NotFound from '../shared/components/NotFound';


export default () => (
  <Switch>
    <Route exact path="/visitor/home" component={Home} />
    <Route path="/visitor/signup" component={Signup} />
    <Route exact path="/visitor/login" component={Login} />
    <Route exact path="/visitor/qrerror" component={QrError} />
    <Route exact path="/visitor/end" component={redirectAfterTimeout('/visitor/home', 5000)(Thanks)} />
    <Route exact path="/visitor/thankyou" component={redirectAfterTimeout('/visitor/home', 5000)(ThanksFeedback)} />
    <Route component={NotFound} />
  </Switch>
);
