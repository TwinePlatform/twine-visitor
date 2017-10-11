import React, { Component } from 'react';
import { Route, Switch, Link } from 'react-router-dom';

import './App.css';
import { Main } from './components/main';
import { QRCode } from './components/qrcode';
import { FormPrivacy } from './components/form_privacy';
import { FormPrivacy2 } from './components/form_privacy2';
import { QRPrivacy } from './components/qrprivacy';
import { QrError } from './components/qrerror';
import { Thanks } from './components/thanks';

class App extends Component {
  render() {
    return (
      <div className="Container">
        <div className="Foreground">
          <Switch>
            <Route exact path="/">
              <div>
                <h1>Where do you want to go?<br /></h1>
                <Link to="/signup"><button className='Button'>Sign up</button></Link><br />
                <Link to="/flow2"><button className='Button'>Login</button></Link><br />
              </div>
            </Route>
            <Route path="/signup" component={Main}/>
            <Route path="/flow2" component={QRCode}/>
            <Route path="/qrerror" component={QrError}/>
            <Route path="/end" component={Thanks}/>
          </Switch>
          <Switch>
            <Route exact path="/signup" component={FormPrivacy}/>
            <Route exact path="/signup/step2" component={FormPrivacy2}/>
            <Route path="/flow2" component={QRPrivacy}/>
            <Route exact path="/qrerror" component={QRPrivacy}/>
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
