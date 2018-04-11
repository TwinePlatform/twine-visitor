import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';

import redirectAfterTimeout from './shared/components/hoc/redirect_after_timeout';
import adminLoginCheck from './shared/components/hoc/admin_login_check';

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

import Login from './cb-admin/pages/Login';
import CbSignupPage from './cb-admin/pages/Signup';
import ConfirmPassword from './cb-admin/pages/ConfirmPassword';
import ForgotPassword from './cb-admin/pages/ForgotPassword';
import ResetPassword from './cb-admin/pages/ResetPassword';
import CbAdminDashboard from './cb-admin/pages/Dashboard';
import CbAdminFeedbackPage from './cb-admin/pages/FeedbackPage';
import CbAdminSettingsPage from './cb-admin/pages/Settings';
import CbAdminVisitorPage from './cb-admin/pages/Visitor';
import CbAdminVisitorDetailsPage from './cb-admin/pages/VisitorDetails';
import CbAdminActivitiesPage from './cb-admin/pages/Activities';
import CbAdminVisitsDataPage from './cb-admin/pages/VisitsData';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = { loggedIn: false, adminToken: '' };
  }

  componentWillMount() {
    this.updateLoggedIn();
  }

  updateLoggedIn = () => {
    const loggedIn = localStorage.getItem('token');
    this.setState({ loggedIn });
  };

  updateAdminToken = adminToken =>
    new Promise((resolve) => {
      this.setState({ adminToken }, resolve);
    });

  render() {
    return (
      <Dots>
        <Container>
          <Switch>
            <PrivateRoute
              auth={this.state.loggedIn}
              updateLoggedIn={this.updateLoggedIn}
              exact
              path="/"
              component={HomePage}
            />

            <Route exact path="/cb/register" component={CbSignupPage} />
            <Route exact path="/cb/password/reset/:token" component={ResetPassword} />
            <Route exact path="/cb/password/forgot" component={ForgotPassword} />
            <Route
              exact
              path="/cb/login"
              render={props =>
                (this.state.loggedIn ? (
                  <Redirect to="/" />
                ) : (
                  <Login setLoggedIn={this.updateLoggedIn} {...props} />
                ))
              }
            />

            <PrivateRoute
              auth={this.state.loggedIn}
              exact
              path="/visitor"
              component={HomeVisitor}
            />

            <PrivateRoute
              auth={this.state.loggedIn}
              exact
              path="/thankyou"
              component={redirectAfterTimeout('/visitor', 5000)(ThankYouFeedback)}
            />

            <PrivateRoute
              auth={this.state.loggedIn}
              exact
              path="/visitor/signup"
              component={Main}
            />

            <PrivateRoute
              auth={this.state.loggedIn}
              exact
              path="/visitor/signup/*"
              component={Main}
            />

            <PrivateRoute
              auth={this.state.loggedIn}
              exact
              path="/visitor/login"
              component={QRCode}
            />

            <PrivateRoute
              auth={this.state.loggedIn}
              exact
              path="/visitor/qrerror"
              component={QrError}
            />

            <PrivateRoute
              auth={this.state.loggedIn}
              exact
              path="/visitor/end"
              component={redirectAfterTimeout('/visitor', 5000)(Thanks)}
            />

            <PrivateRoute
              auth={this.state.loggedIn}
              updateAdminToken={this.updateAdminToken}
              exact
              path="/admin/login"
              component={ConfirmPassword}
            />

            <AdminRoute
              auth={this.state.adminToken}
              updateAdminToken={this.updateAdminToken}
              exact
              path="/admin"
              updateLoggedIn={this.updateLoggedIn}
              component={CbAdminDashboard}
            />

            <AdminRoute
              auth={this.state.adminToken}
              updateAdminToken={this.updateAdminToken}
              exact
              path="/cb/activities"
              component={CbAdminActivitiesPage}
            />

            <AdminRoute
              auth={this.state.adminToken}
              updateAdminToken={this.updateAdminToken}
              exact
              path="/cb/visitors"
              updateLoggedIn={this.updateLoggedIn}
              component={CbAdminVisitorDetailsPage}
            />

            <AdminRoute
              auth={this.state.adminToken}
              updateAdminToken={this.updateAdminToken}
              exact
              path="/cb/visits"
              updateLoggedIn={this.updateLoggedIn}
              component={CbAdminVisitsDataPage}
            />

            <AdminRoute
              auth={this.state.adminToken}
              updateAdminToken={this.updateAdminToken}
              exact
              path="/cb/visitors/:id"
              updateLoggedIn={this.updateLoggedIn}
              component={CbAdminVisitorPage}
            />

            <AdminRoute
              auth={this.state.adminToken}
              updateAdminToken={this.updateAdminToken}
              exact
              path="/cb/settings"
              updateLoggedIn={this.updateLoggedIn}
              component={CbAdminSettingsPage}
            />

            <AdminRoute
              auth={this.state.adminToken}
              updateAdminToken={this.updateAdminToken}
              exact
              path="/cb/feedback"
              updateLoggedIn={this.updateLoggedIn}
              component={adminLoginCheck(CbAdminFeedbackPage)}
            />

            <Route exact path="/internalServerError" component={InternalServerError} />
            <Route exact path="/error/404" component={NotFound} />
            <Route exact path="/error/:code" component={InternalServerError} />
            <Route component={NotFound} />
          </Switch>
        </Container>
      </Dots>
    );
  }
}

export default App;
