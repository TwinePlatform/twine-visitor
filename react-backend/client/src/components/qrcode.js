/*global Instascan*/
import React, { Component } from 'react';
import { Input } from './input';
import { Select } from './select';
import { Button } from './button';
import { PurposeButton } from './purposeButton';
import {Route, Switch, Link} from 'react-router-dom';
import { withRouter } from 'react-router-dom'


function getUserFromQRScan(content) {
  return fetch('/getUsername', {
    method: "POST",
    body: JSON.stringify(content)
  })
  .then(res=>res.text())
}

function instascan() {
  return new Promise((resolve, reject)=>{
    let scanner = new Instascan.Scanner({
      video: document.getElementById('preview'),
      scanPeriod: 5
    });
    scanner.addListener('scan', function(content) {
      console.log("I am instascan reader: ", content);
      if (document.getElementById('preview')) {
        document.getElementById('preview').pause();
      }
      resolve(content)
    });
    Instascan.Camera.getCameras().then(function(cameras) {
      if (cameras.length > 0) {
        console.log(cameras);
        scanner.start(cameras[0]);
      } else {
        console.error('No cameras found.');
      }
    }).catch(function(e) {
      console.error(e);
    });
  })
}


export class QRCode extends Component {
  constructor() {
    super();

    this.state = {
      login: 1,
      username: '',
      qrcode: '',
      activity: 'not selected'
    }

    this.handleVideo = this.handleVideo.bind(this);

    this.changeActivity = this.changeActivity.bind(this);
  }

  handleVideo = (e) => {
    console.log('video has ended');
    let newState = {};
    newState['login'] = this.state.login+1;
    this.setState(newState);
  };

  changeActivity = (newActivity) => {
    this.setState({
      activity: newActivity
    });
      console.log("activity: ", this.state.activity);
  };

  componentDidMount(){
    if(this.state.login===1){
      instascan()
      .then(getUserFromQRScan)
      .then((user)=>{
        this.setState({username:user});
      })
    }
  }

    componentWillUpdate(nextProps, nextState) {
    if (nextState.username ==='there is no registered user') {
      this.props.history.push('/qrerror')
    }
  }

  render() {
    if (this.state.login === 1) {
      return (
        <section className="Main">
          <h1>WELCOME BACK!</h1>
          <div id="instascan">
            <video id="preview" className="Video active" onPause={this.handleVideo}></video>
          </div>
        </section>
      )
    } else {
      return (
        <section className="Main">
          <h1>Welcome Back, {this.state.username}</h1>

            <PurposeButton session="Yoga" activity={this.state.activity} onClick={this.changeActivity}/> <br/>
            <PurposeButton session="Dancing" activity={this.state.activity} onClick={this.changeActivity}/><br/>
            <PurposeButton session="Baking" activity={this.state.activity} onClick={this.changeActivity}/>


        </section>
      )
    }
  }
}

const MainWithRouter = withRouter(QRCode); //to get history and use history.push
