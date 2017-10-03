import React, {Component} from 'react';
import './App.css';
import { Main } from './components/main';
import { QRCode } from './components/main_copy';
import { Privacy } from './components/privacy';
import { QRPrivacy } from './components/privacy_copy';

class App extends Component {
  render() {
    return (
      <div className="Container">
        <div className ="Foreground">
        <QRCode />
        <QRPrivacy />
        </div>
      </div>
    );
  }
}

export default App;
