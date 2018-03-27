import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';

import redirectAfterTimeout from './components/hoc/redirect_after_timeout';
import adminLoginCheck from './shared/components/hoc/admin_login_check';

import Main from './components/visitors/main';
import QRCode from './components/visitors/qrcode';
import QrError from './components/visitors/qrerror';
import Thanks from './components/visitors/thanks';
import HomeVisitor from './components/visitors/homeVisitor';
import ThankYouFeedback from './components/visitors/thank_you_feedback';

import AdminMenuPage from './components/admin/adminMenuPage';
import AdminActivitiesPage from './components/admin/adminActivitiesPage';
import AdminVisitsPage from './components/admin/adminVisitsPage';
import AdminUsersPage from './components/admin/adminUsersPage';
import AdminUserDetailsPage from './components/admin/adminUserDetailsPage';
import AdminCBSettingsPage from './components/admin/adminCBSettingsPage';
import CbAdminFeedbackPage from './cb-admin/pages/CbAdminFeedbackPage';

import NotFound from './components/NotFound';
import InternalServerError from './components/InternalServerError';

import Container from './shared/components/Container';
import HomePage from './shared/pages/Home';
import Login from './cb-admin/pages/Login';
import CbSignupPage from './cb-admin/pages/Signup';
import ConfirmPassword from './cb-admin/pages/ConfirmPassword';
import ForgotPassword from './cb-admin/pages/ForgotPassword';
import ResetPassword from './cb-admin/pages/ResetPassword';


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
            component={AdminMenuPage}
          />

          <AdminRoute
            auth={this.state.adminToken}
            updateAdminToken={this.updateAdminToken}
            exact
            path="/admin/activities"
            component={AdminActivitiesPage}
          />

          <AdminRoute
            auth={this.state.adminToken}
            updateAdminToken={this.updateAdminToken}
            exact
            path="/admin/visits"
            updateLoggedIn={this.updateLoggedIn}
            component={AdminVisitsPage}
          />

          <AdminRoute
            auth={this.state.adminToken}
            updateAdminToken={this.updateAdminToken}
            exact
            path="/admin/users"
            updateLoggedIn={this.updateLoggedIn}
            component={AdminUsersPage}
          />

          <AdminRoute
            auth={this.state.adminToken}
            updateAdminToken={this.updateAdminToken}
            exact
            path="/admin/user/:userId"
            updateLoggedIn={this.updateLoggedIn}
            component={AdminUserDetailsPage}
          />

          <AdminRoute
            auth={this.state.adminToken}
            updateAdminToken={this.updateAdminToken}
            exact
            path="/admin/accountSettings"
            updateLoggedIn={this.updateLoggedIn}
            component={AdminCBSettingsPage}
          />

          <AdminRoute
            auth={this.state.adminToken}
            updateAdminToken={this.updateAdminToken}
            exact
            path="/admin/feedback"
            updateLoggedIn={this.updateLoggedIn}
            component={adminLoginCheck(CbAdminFeedbackPage)}
          />

          <Route exact path="/internalServerError" component={InternalServerError} />
          <Route component={NotFound} />
        </Switch>
      </Container>
    );
  }
}

export default App;
