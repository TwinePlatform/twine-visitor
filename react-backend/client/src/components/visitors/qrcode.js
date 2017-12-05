/*global Instascan*/
import React, { Component } from 'react';
import { PurposeButton } from './purposeButton';
import { withRouter } from 'react-router-dom';

function getUserFromQRScan(content) {
  const headers = new Headers({
    Authorization: localStorage.getItem('token'),
  });
  return fetch('/getUsername', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      headers,
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
      if (document.getElementById('preview')) {
        scanner
          .stop()
          .then(res => {
            resolve(content);
          })
          .catch(error => {
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
          reject('ERROR HAPPENING AT getCameras');
        }
      })
      .catch(err => {
        reject(err);
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

    const headers = new Headers({
      Authorization: localStorage.getItem('token'),
    });

    return fetch('/postActivity', {
      method: 'POST',
      headers,
      body: JSON.stringify(visitInfo),
    })
      .then(this.props.history.push('/visitor/end'))
      .catch(error => {
        console.log('ERROR HAPPENING AT FETCH /postActivity', error);
        this.props.history.push('/visitor/login');
        throw error;
      });
  };

  componentDidMount() {
    if (this.state.login === 1) {
      instascan()
        .then(content => {
          this.handleVideo();
          return getUserFromQRScan(content);
        })
        .then(user => {
          this.setState({
            username: user.fullname,
            hash: user.hash,
          });
        })
        .catch(error => {
          console.log('ERROR HAPPENING AT INSTASCAN', error);
          this.props.history.push('/visitor/qrerror');
        });
    }
    const headers = new Headers({
      Authorization: localStorage.getItem('token'),
    });
    fetch('/activities', {
      method: 'GET',
      headers,
    })
      .then(res => res.json())
      .then(res => res.activities)
      .then(activities => {
        this.setState({ activities });
      })
      .catch(error => {
        console.log('ERROR HAPPENING AT FETCH', error);
        this.props.history.push('/visitor/qrerror');
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
