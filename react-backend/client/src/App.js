import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import './App.css';

import { Home } from './components/home';

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
  render() {
    return (
      <div className="Container">
        <div className="Foreground">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/visitor" component={HomeVisitor} />
            <Route path="/visitor/signup" component={Main} />
            <Route exact path="/visitor/login" component={QRCode} />
            <Route exact path="/visitor/qrerror" component={QrError} />
            <Route exact path="/visitor/end" component={Thanks} />
            <Route exact path="/admin" component={HomeAdmin} />
            <Route component={NotFound} />
          </Switch>
          <Route exact path="/visitor/signup" component={FormPrivacy} />
          <Route exact path="/visitor/signup/step2" component={FormPrivacy2} />
          <Route exact path="/visitor/login" component={QRPrivacy} />
          <Route exact path="/visitor/qrerror" component={QRPrivacy} />
        </div>
      </div>
    );
  }
}

export default App;
