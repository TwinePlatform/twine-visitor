import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';

import redirectAfterTimeout from './components/hoc/redirect_after_timeout';

import Home from './components/home';

import CBsignup from './components/authentication/signupcb';
import CBlogin from './components/authentication/logincb';
import NewPassword from './components/authentication/newPassword';
import CBPswdReset from './components/authentication/pswdresetcb';

import Main from './components/visitors/main';
import QRCode from './components/visitors/qrcode';
import QrError from './components/visitors/qrerror';
import Thanks from './components/visitors/thanks';
import HomeVisitor from './components/visitors/homeVisitor';
import ThankYouFeedback from './components/visitors/thank_you_feedback';

import AdminLogin from './components/admin/admin_login';
import AdminMenuPage from './components/admin/adminMenuPage';
import AdminActivitiesPage from './components/admin/adminActivitiesPage';
import AdminVisitsPage from './components/admin/adminVisitsPage';
import AdminUsersPage from './components/admin/adminUsersPage';
import AdminUserDetailsPage from './components/admin/adminUserDetailsPage';
import AdminCBSettingsPage from './components/admin/adminCBSettingsPage';

import NotFound from './components/NotFound';
import InternalServerError from './components/InternalServerError';

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
      <div className="Container">
        <div className="Foreground">
          <Switch>
            <PrivateRoute auth={this.state.loggedIn} exact path="/" component={Home} />

            <Route exact path="/signupcb" component={CBsignup} />
            <Route exact path="/newPassword/:token" component={NewPassword} />
            <Route exact path="/pswdresetcb" component={CBPswdReset} />
            <Route
              exact
              path="/logincb"
              render={props =>
                (this.state.loggedIn ? (
                  <Redirect to="/" />
                ) : (
                  <CBlogin setLoggedIn={this.updateLoggedIn} {...props} />
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
              component={AdminLogin}
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

            <Route exact path="/internalServerError" component={InternalServerError} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
