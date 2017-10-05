import React, { Component } from 'react';
import './App.css';
import { Main } from './components/main';
import { QRCode } from './components/main_copy';
import { FormPrivacy } from './components/privacy';
import { QRPrivacy } from './components/privacy_copy2';
import { FormPrivacy2 } from './components/privacy_copy';

class App extends Component {
  render() {
    return (
      <div className="Container">
        <div className="Foreground">
          <Main />
          <FormPrivacy />
        </div>
      </div>
    );
  }
}

export default App;
