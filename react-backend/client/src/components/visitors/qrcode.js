/*global Instascan*/
import React, { Component } from 'react';
import { PurposeButton } from './purposeButton';
import { withRouter} from 'react-router-dom';


function getUserFromQRScan(content) {
  return fetch('/getUsername', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({user:content})
  })
  .then(res=>res.json())
  .catch((err) => {
    console.log("error from getUserFromQRScan:  ", err);
    throw err
  })
}

function instascan() {
  return new Promise((resolve, reject)=>{
    let scanner = new Instascan.Scanner({
      video: document.getElementById('preview'),
      scanPeriod: 5
    });
    scanner.addListener('scan', function(content) {
      if (document.getElementById('preview')) {
        document.getElementById('preview').pause();
      }
      resolve(content)
    });
    Instascan.Camera.getCameras().then((cameras) => {
      if (cameras.length > 0) {
        scanner.start(cameras[0]);
      } else {
        console.error('No cameras found.');
      }
    }).catch((err) => {
      console.error(err);
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
    let newState = {};
    newState['login'] = this.state.login+1;
    this.setState(newState);
  };

  changeActivity = (newActivity) => {
    this.setState({
      activity: newActivity
    });

    const visitInfo = {
      hash: this.state.hash,
      activity: newActivity
    }

    return fetch('/postActivity', {
      method: "POST",
      body: JSON.stringify(visitInfo)
    }).then(
      this.props.history.push('/visitor/end')
    );
  };

  componentDidMount(){
    if(this.state.login===1){
      instascan()
      .then(getUserFromQRScan)
      .then((user)=>{
        this.setState({username:user.fullname, hash:user.hash});
      })
    }
  }

    componentWillUpdate(nextProps, nextState) {
    if (nextState.username ==='there is no registered user') {
      this.props.history.push('/visitor/qrerror')
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
          <h1 className="capitalise" id="username">Welcome Back, {this.state.username}</h1>

            <PurposeButton session="Yoga" activity={this.state.activity} onClick={this.changeActivity}/> <br/>
            <PurposeButton session="French Lessons" activity={this.state.activity} onClick={this.changeActivity}/><br/>
            <PurposeButton session="Baking Lessons" activity={this.state.activity} onClick={this.changeActivity}/><br/>
            <PurposeButton session="Self-Defence Class" activity={this.state.activity} onClick={this.changeActivity}/><br/>
            <PurposeButton session="Flamenco Dancing" activity={this.state.activity} onClick={this.changeActivity}/>


        </section>
      )
    }
  }
}

withRouter(QRCode); //to get history and use history.push
