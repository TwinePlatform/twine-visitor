import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';

import './App.css';

import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import Home from './components/home';

import { CBsignup } from './components/authentication/signupcb';
import { CBlogin } from './components/authentication/logincb';
import { NewPassword } from './components/authentication/newPassword';
import { CBPswdReset } from './components/authentication/pswdresetcb';

import { Main } from './components/visitors/main';
import { QRCode } from './components/visitors/qrcode';
import { QrError } from './components/visitors/qrerror';
import { Thanks } from './components/visitors/thanks';
import { HomeVisitor } from './components/visitors/homeVisitor';

import { AdminLogin } from './components/admin/admin_login';
import { AdminMenuPage } from './components/admin/adminMenuPage';
import { AdminActivitiesPage } from './components/admin/adminActivitiesPage';
import { AdminVisitsPage } from './components/admin/adminVisitsPage';
import { AdminUsersPage } from './components/admin/adminUsersPage';
import { AdminUserDetailsPage } from './components/admin/adminUserDetailsPage';
import { AdminCBSettingsPage } from './components/admin/adminCBSettingsPage';

import { NotFound } from './components/NotFound';
import { InternalServerError } from './components/InternalServerError';

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

  logout = () => {
    localStorage.removeItem('token');
    this.setState({ loggedIn: false, adminToken: '' });
  };

  updateAdminToken = adminToken =>
    new Promise(resolve => {
      this.setState({ adminToken }, resolve);
    });

  render() {
    const adminProps = {
      auth: this.state.adminToken,
      updateAdminToken: this.updateAdminToken,
      linkFunction: this.logout,
      exact: true,
      updateLoggedIn: this.updateLoggedIn,
    };

    const routeProps = {
      auth: this.state.loggedIn,
      linkFunction: this.signup,
      linkText: 'Signup',
      linkTo: '/visitor/signup',
      exact: true,
    };

    return (
      <MuiThemeProvider>
        <Paper
          style={{
            width: '100%',
            maxWidth: 950,
            margin: '0 auto',
            boxSizing: 'border-box',
          }}
          zDepth={2}
        >
          <Switch>
            <PrivateRoute path="/" component={Home} {...routeProps} />

            <Route exact path="/signupcb" component={CBsignup} />
            <Route exact path="/newPassword" component={NewPassword} />
            <Route exact path="/pswdresetcb" component={CBPswdReset} />
            <Route
              exact
              path="/logincb"
              render={props =>
                this.state.loggedIn ? (
                  <Redirect to="/" />
                ) : (
                  <CBlogin setLoggedIn={this.updateLoggedIn} {...props} />
                )
              }
            />

            <PrivateRoute
              path="/visitor"
              component={HomeVisitor}
              title="Visitor dashboard"
              home
              {...routeProps}
            />

            <PrivateRoute
              path="/visitor/signup"
              component={Main}
              title="Visitor signup"
              back="/visitor"
              {...routeProps}
            />

            <PrivateRoute
              path="/visitor/signup/*"
              component={Main}
              title="Visitor signup"
              back="/visitor/signup"
              {...routeProps}
            />

            <PrivateRoute
              path="/visitor/login"
              component={QRCode}
              title="Visitor login"
              back="/visitor"
              {...routeProps}
            />

            <PrivateRoute
              path="/visitor/qrerror"
              component={QrError}
              title="Visitor QR error"
              back="/visitor"
              {...routeProps}
            />

            <PrivateRoute
              path="/visitor/end"
              component={Thanks}
              title="Visitor login"
              home
              {...routeProps}
            />

            <PrivateRoute
              path="/admin/login"
              component={AdminLogin}
              updateAdminToken={this.updateAdminToken}
              title="Admin login"
              home
              {...routeProps}
            />

            <AdminRoute
              component={AdminMenuPage}
              title="Admin Dashboard"
              path="/admin"
              home
              {...adminProps}
            />

            <AdminRoute
              component={AdminActivitiesPage}
              title="Activity Dashboard"
              path="/admin/activities"
              back="/admin"
              {...adminProps}
            />

            <AdminRoute
              component={AdminVisitsPage}
              title="Visitor Dashboard"
              path="/admin/visits"
              back="/admin"
              {...adminProps}
            />

            <AdminRoute
              component={AdminUsersPage}
              title="Users Dashboard"
              path="/admin/users"
              back="/admin"
              {...adminProps}
            />

            <AdminRoute
              component={AdminUserDetailsPage}
              title="User Details"
              path="/admin/user/:userId"
              back="/admin/users"
              {...adminProps}
            />

            <AdminRoute
              component={AdminCBSettingsPage}
              path="/admin/accountSettings"
              title="Account Settings"
              back="/admin"
              {...adminProps}
            />

            <Route
              exact
              path="/internalServerError"
              component={InternalServerError}
            />
            <Route component={NotFound} />
          </Switch>
        </Paper>
      </MuiThemeProvider>
    );
  }
}

export default App;
