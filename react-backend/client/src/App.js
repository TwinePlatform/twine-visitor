import React, {Component} from 'react';
import {Route, Switch, Link} from 'react-router-dom';

import './App.css';
import {Main} from './components/main';
import {QRCode} from './components/qrcode';
import {FormPrivacy} from './components/form_privacy';
import {FormPrivacy2} from './components/form_privacy2';
import {QRPrivacy} from './components/qrprivacy';

class App extends Component {
  render() {
    return (
      <div className="Container">
        <div className="Foreground">
          <Switch>
            <Route exact path="/">
              <div>
                Where do you want to go?<br/>
              <Link to="/signup">Sign up</Link><br/>
                <Link to="/flow2">Login</Link><br/>
              </div>
            </Route>
            <Route path="/signup" component={Main}/>
            <Route path="/flow2" component={QRCode}/>
          </Switch>
          <Switch>
            <Route exact path="/" component={FormPrivacy}/>
            <Route exact path="/signup" component={FormPrivacy}/>
            <Route exact path="/signup/step2" component={FormPrivacy2}/>
            <Route exact path="/flow2" component={QRPrivacy}/>
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
