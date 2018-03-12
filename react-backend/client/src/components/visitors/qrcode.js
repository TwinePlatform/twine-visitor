/* global Instascan */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import PurposeButton from './purposeButton';
import QRPrivacy from '../visitors/qrprivacy';
import { Activities, Visitors } from '../../api';


function instascan() {
  return new Promise((resolve, reject) => {
    const scanner = new Instascan.Scanner({
      video: document.getElementById('preview'),
      scanPeriod: 5,
    });
    scanner.addListener('scan', (content) => {
      if (document.getElementById('preview')) {
        scanner
          .stop()
          .then(() => {
            resolve(content);
          })
          .catch(() => {
            reject('failure stopping scanner');
          });
      } else {
        document.getElementById('preview').play();
        reject('ADD LISTENER FAILED');
      }
    });
    Instascan.Camera.getCameras()
      .then((cameras) => {
        if (cameras.length > 0) {
          scanner.start(cameras[0]);
        } else {
          reject('ERROR HAPPENING AT getCameras');
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export default class QRCode extends Component {
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

  componentDidMount() {
    if (this.state.login === 1) {
      instascan()
        .then((content) => {
          this.handleVideo();
          return Visitors.get(localStorage.getItem('token'), { hash: content });
        })
        .then((res) => {
          this.setState({
            username: res.data.fullname,
            hash: res.data.hash,
          });
        })
        .catch((error) => {
          console.log('ERROR HAPPENING AT INSTASCAN', error);
          this.props.history.push('/visitor/qrerror');
        });
    }

    Activities.get(localStorage.getItem('token'), { weekday: 'today' })
      .then((res) => {
        this.setState({ activities: res.data.activities });
      })
      .catch((error) => {
        console.log('ERROR HAPPENING AT FETCH', error);
        this.props.history.push('/visitor/qrerror');
      });
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.username === 'there is no registered user') {
      this.props.history.push('/visitor/qrerror');
    }
  }

  handleVideo = () => this.setState({ login: this.state.login + 1 })

  headers = new Headers({
    Authorization: localStorage.getItem('token'),
  });

  headersPost = new Headers({
    Authorization: localStorage.getItem('token'),
    'Content-Type': 'application/json',
  });

  changeActivity = (newActivity) => {
    this.setState({ activity: newActivity });

    Visitors.createVisit(localStorage.getItem('token'), { hash: this.state.hash, activity: newActivity })
      .then(() => this.props.history.push('/visitor/end'))
      .catch((error) => {
        console.log('ERROR HAPPENING AT FETCH /api/visit/add', error);
        this.props.history.push('/visitor/login');
      });
  };

  render() {
    if (this.state.login === 1) {
      return (
        <div className="row">
          <section className="Main col-9">
            <h1>WELCOME BACK!</h1>
            <div id="instascan">
              <video id="preview" className="Video active" />
            </div>
          </section>
          <QRPrivacy className="col-3" />
        </div>
      );
    }
    return (
      <div className="row">
        <section className="Main col-9">
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
        <QRPrivacy className="col-3" />
      </div>
    );
  }
}

withRouter(QRCode); // to get history and use history.push

QRCode.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};
