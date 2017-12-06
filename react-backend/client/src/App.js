import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import './App.css';

import { Home } from './components/home';

import { CBsignup } from './components/authentication/signupcb';
import { CBlogin } from './components/authentication/logincb';

import { Main } from './components/visitors/main';
import { QRCode } from './components/visitors/qrcode';
import { FormPrivacy } from './components/visitors/form_privacy';
import { FormPrivacy2 } from './components/visitors/form_privacy2';
import { QRPrivacy } from './components/visitors/qrprivacy';
import { QrError } from './components/visitors/qrerror';
import { Thanks } from './components/visitors/thanks';
import { HomeVisitor } from './components/visitors/homeVisitor';

import { HomeAdmin } from './components/admin/homeAdmin';

import { NotFound } from './components/NotFound';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { loggedIn: false };
  }

  componentWillMount() {
    this.updateLoggedIn();
  }

  updateLoggedIn = () => {
    const loggedIn = Boolean(localStorage.getItem('token'));
    this.setState({ loggedIn });
  };

  render() {
    return (
      <div className="Container">
        <div className="Foreground">
          <Switch>
            <Route
              exact
              path="/"
              render={props =>
                this.state.loggedIn ? (
                  <Home {...props} updateLoggedIn={this.updateLoggedIn} />
                ) : (
                  <Redirect to="/logincb" />
                )
              }
            />
            <Route exact path="/signupcb" component={CBsignup} />

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

            <Route
              exact
              path="/visitor"
              render={props =>
                this.state.loggedIn ? (
                  <HomeVisitor {...props} updateLoggedIn={this.updateLoggedIn} />
                ) : (
                  <Redirect to="/logincb" />
                )
              }
            />
            <Route
              path="/visitor/signup"
              render={props =>
                this.state.loggedIn ? <Main {...props} /> : <Redirect to="/logincb" />
              }
            />
            <Route
              exact
              path="/visitor/login"
              render={props =>
                this.state.loggedIn ? <QRCode {...props} /> : <Redirect to="/logincb" />
              }
            />

            <Route
              exact
              path="/visitor/qrerror"
              render={props =>
                this.state.loggedIn ? <QrError {...props} /> : <Redirect to="/logincb" />
              }
            />

            <Route
              exact
              path="/visitor/end"
              render={props =>
                this.state.loggedIn ? <Thanks {...props} /> : <Redirect to="/logincb" />
              }
            />

            <Route exact path="/admin" component={HomeAdmin} />
            <Route component={NotFound} />
          </Switch>

          <Route
            exact
            path="/visitor/signup"
            render={props =>
              this.state.loggedIn ? <FormPrivacy {...props} /> : <Redirect to="/logincb" />
            }
          />

          <Route
            exact
            path="/visitor/signup/step2"
            render={props =>
              this.state.loggedIn ? <FormPrivacy2 {...props} /> : <Redirect to="/logincb" />
            }
          />

          <Route
            exact
            path="/visitor/login"
            render={props =>
              this.state.loggedIn ? <QRPrivacy {...props} /> : <Redirect to="/logincb" />
            }
          />

          <Route
            exact
            path="/visitor/qrerror"
            render={props =>
              this.state.loggedIn ? <QRPrivacy {...props} /> : <Redirect to="/logincb" />
            }
          />
        </div>
      </div>
    );
  }
}

export default App;
