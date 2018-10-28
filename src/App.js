import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import redirectAfterTimeout from './shared/components/hoc/redirect_after_timeout';

import Main from './visitors/pages/main';
import QRCode from './visitors/pages/qrcode';
import QrError from './visitors/pages/qrerror';
import Thanks from './visitors/pages/thanks';
import HomeVisitor from './visitors/pages/homeVisitor';
import ThankYouFeedback from './visitors/pages/thank_you_feedback';

import NotFound from './shared/components/NotFound';
import InternalServerError from './shared/components/InternalServerError';

import Dots from './shared/components/Dots';
import Container from './shared/components/Container';
import HomePage from './shared/pages/Home';

import Login from './cb_admin/pages/Login';
import ConfirmPassword from './cb_admin/pages/ConfirmPassword';
import ForgotPassword from './cb_admin/pages/ForgotPassword';
import ResetPassword from './cb_admin/pages/ResetPassword';
import CbAdminDashboard from './cb_admin/pages/Dashboard';
import CbAdminFeedback from './cb_admin/pages/Feedback';
import CbAdminSettingsPage from './cb_admin/pages/Settings';
import CbAdminVisitorPage from './cb_admin/pages/Visitor';
import CbAdminVisitorDetailsPage from './cb_admin/pages/VisitorDetails';
import CbAdminActivitiesPage from './cb_admin/pages/Activities';
import CbAdminVisitsDataPage from './cb_admin/pages/VisitsData';


export default class App extends Component {

  componentWillMount() {
    // avoid eslint errors to keep this a class component
  }

  render() {
    return (
      <Dots>
        <Container>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/cb/password/reset/:token" component={ResetPassword} />
            <Route exact path="/cb/password/forgot" component={ForgotPassword} />
            <Route exact path="/cb/login" component={Login} />

            <Route exact path="/visitor" component={HomeVisitor} />
            <Route exact path="/thankyou" component={redirectAfterTimeout('/visitor', 5000)(ThankYouFeedback)} />

            <Route exact path="/visitor/signup" component={Main} />

            <Route exact path="/visitor/signup/*" component={Main} />

            <Route exact path="/visitor/login" component={QRCode} />

            <Route exact path="/visitor/qrerror" component={QrError} />

            <Route exact path="/visitor/end" component={redirectAfterTimeout('/visitor', 5000)(Thanks)} />

            <Route exact path="/admin/login" component={ConfirmPassword} />

            <Route exact path="/admin" component={CbAdminDashboard} />

            <Route exact path="/cb/activities" component={CbAdminActivitiesPage} />

            <Route exact path="/cb/visitors" component={CbAdminVisitorDetailsPage} />

            <Route exact path="/cb/visits" component={CbAdminVisitsDataPage} />

            <Route exact path="/cb/visitors/:id" component={CbAdminVisitorPage} />

            <Route exact path="/cb/settings" component={CbAdminSettingsPage} />

            <Route exact path="/cb/feedback" component={CbAdminFeedback} />

            <Route exact path="/cb/feedback" component={CbAdminFeedback} />

            <Route exact path="/error/404" component={NotFound} />
            <Route exact path="/error/:code" component={InternalServerError} />
            <Route component={NotFound} />
          </Switch>
        </Container>
      </Dots>
    );
  }
}