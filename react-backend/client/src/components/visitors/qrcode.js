/*global Instascan*/
import React, { Component } from 'react';
import { PurposeButton } from './purposeButton';
import { withRouter } from 'react-router-dom';

function getUserFromQRScan(content) {
  console.log('getUserFromQRScan: ', content);
  return fetch('/getUsername', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user: content }),
  })
    .then(res => res.json())
    .catch(err => {
      console.log('error from getUserFromQRScan:  ', err);
      throw err;
    });
}

function instascan() {
  return new Promise((resolve, reject) => {
    let scanner = new Instascan.Scanner({
      video: document.getElementById('preview'),
      scanPeriod: 5,
    });
    scanner.addListener('scan', function(content) {
      console.log(document.getElementById('preview'));
      if (document.getElementById('preview')) {
        console.log('scanner listener: ', content);
        //previously you were calling .pause on the video element here, this
        //paused the video element but didn't do anything with the scanner that
        //you created above
        //So (i think) whenever you ran this it created a new scanner somehow
        //it just messed with the old one
        //so now when the scanner scans
        //we stop the scanner using scanner.stop() which returns a Promise
        //and on success we resolve the overall promise with the Content
        //and reject the promise if there's a problem scanning.

        scanner
          .stop()
          .then(res => {
            resolve(content);
            console.log(('stopped': res));
          })
          .catch(error => {
            console.log('error at stop scanner');
            reject('failure stopping scanner');
          });
      } else {
        document.getElementById('preview').play();
        reject('ADD LISTENER FAILED');
      }
    });
    Instascan.Camera.getCameras()
      .then(cameras => {
        if (cameras.length > 0) {
          scanner.start(cameras[0]);
        } else {
          console.error('No cameras found.');
          console.log('ERROR HAPPENING AT getCameras');

          throw new Error('ERROR HAPPENING AT getCameras');
        }
      })
      .catch(err => {
        console.log('ERROR HAPPENING AT getCameras');
        console.log(err);
        throw err;
      });
  });
}

export class QRCode extends Component {
  constructor() {
    super();

    this.state = {
      login: 1,
      username: '',
      qrcode: '',
      activity: 'not selected',
      activities: [],
    };

    this.handleVideo = this.handleVideo.bind(this);

    this.changeActivity = this.changeActivity.bind(this);
  }

  handleVideo = e => {
    let newState = {};
    newState['login'] = this.state.login + 1;
    this.setState(newState);
  };

  changeActivity = newActivity => {
    this.setState({
      activity: newActivity,
    });

    const visitInfo = {
      hash: this.state.hash,
      activity: newActivity,
    };

    return fetch('/postActivity', {
      method: 'POST',
      body: JSON.stringify(visitInfo),
    })
      .then(this.props.history.push('/visitor/end'))
      .catch(error => {
        console.log('ERROR HAPPENING AT FETCH /postActivity');
        console.log(error);
      });
  };

  componentDidMount() {
    if (this.state.login === 1) {
      instascan()
        .then(content => {
          //here, when the instascan promise resolves (when the scan event
          //triggers) we call the handleVideo method on this class, to change
          //the state to trigger the change in view, then call get
          //getUserFromQRScan with the Content
          //and everything (seems) to work okay
          console.log('instascan() has resolved: ', content);
          this.handleVideo();
          return getUserFromQRScan(content);
        })
        .then(user => {
          this.setState({
            username: user.fullname.fullname,
            hash: user.fullname.hash,
          });
        })
        .catch(error => {
          console.log('ERROR HAPPENING AT INSTASCANE');
          console.log(error);
        });
    }

    fetch('/activities')
      .then(res => res.json())
      .then(res => res.activities)
      .then(activities => {
        this.setState({ activities });
      })
      .catch(error => {
        console.log('ERROR HAPPENING AT FETCH');
        console.log(error);
      });
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.username === 'there is no registered user') {
      this.props.history.push('/visitor/qrerror');
    }
  }

  render() {
    if (this.state.login === 1) {
      return (
        <section className="Main">
          <h1>WELCOME BACK!</h1>
          <div id="instascan">
            <video id="preview" className="Video active" />
          </div>
        </section>
      );
    } else {
      return (
        <section className="Main">
          <h1 className="capitalise" id="username">
            Welcome Back, {this.state.username}
          </h1>

          {this.state.activities.map(activity => (
            <PurposeButton
              key={activity.name}
              session={activity.name}
              activity={this.state.activity}
              onClick={this.changeActivity}
            />
          ))}
        </section>
      );
    }
  }
}

withRouter(QRCode); //to get history and use history.push
