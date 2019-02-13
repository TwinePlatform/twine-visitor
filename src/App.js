import React from 'react';
import { Route, Switch } from 'react-router-dom';

import NotFound from './shared/components/NotFound';
import InternalServerError from './shared/components/InternalServerError';

import Dots from './shared/components/Dots';
import Container from './shared/components/Container';
import HomePage from './shared/pages/Home';

import VisitorRoutes from './visitors';
import CbAdminRoutes from './cb_admin';
import Login from './cb_admin/pages/Login';
import PrivateRoute from './auth/PrivateRoute';
import ResetPassword from './cb_admin/pages/ResetPassword';
import ForgotPassword from './cb_admin/pages/ForgotPassword';


const ProtectedRoutes = () => (
  <Switch>
    <Route exact path="/" component={HomePage} />
    <Route path="/visitor/*" component={VisitorRoutes} />
    <Route path="/admin" component={CbAdminRoutes} />

    <Route exact path="/error/404" component={NotFound} />
    <Route exact path="/error/:code" component={InternalServerError} />
    <Route component={NotFound} />
  </Switch>);

const App = () => (
  <Dots>
    <Container>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/password/reset/:token" component={ResetPassword} />
        <Route exact path="/password/forgot" component={ForgotPassword} />
        <PrivateRoute path="/*" component={ProtectedRoutes} />
      </Switch>
    </Container>
  </Dots>
);

export default App;
