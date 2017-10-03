import React, {Component} from 'react';
import './App.css';
import { Main } from './components/main';
import { Privacy } from './components/privacy';

class App extends Component {
  render() {
    return (
      <div className="Container">
        <div className ="Foreground">
        <Main />
        <Privacy />
        </div>
      </div>
    );
  }
}

export default App;
