/* global Instascan */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import PurposeButton from './purposeButton';
import QRPrivacy from '../visitors/qrprivacy';
import { Activities, Visitors } from '../../api';
import { Heading } from '../../shared/components/text/base';
import { FlexContainerRow } from '../../shared/components/layout/base';

const StyledNav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledSection = styled.section`
  margin: 3rem 0;
  display: flex;
  justify-content: center;
`;

const HalfFlexContainerRow = FlexContainerRow.extend`
  width: 50%;
  padding: 1rem;
  flex-wrap: wrap;
`;

const SnakeContainerRow = FlexContainerRow.extend`
  width: 100%;
  justify-content: space-between;
  &:nth-child(2n) {
  flex-direction: row-reverse;
  `;

const capitaliseFirstName = name => name.split(' ')[0].replace(/\b\w/g, l => l.toUpperCase());


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
      <section>
        <StyledNav>
          <Heading>
              Welcome back, {capitaliseFirstName(this.state.username)}! Why are you here today?
          </Heading>
        </StyledNav>
        <StyledSection>
          <HalfFlexContainerRow>
            {this.state.activities.map((activity, index) => (
              <PurposeButton
                key={activity.name}
                color={index}
                session={activity.name}
                activity={this.state.activity}
                onClick={this.changeActivity}
              />
            ))
              .reduce((acc, el, index, array) =>
                (index % 2 === 0
                  ? acc.concat([
                    <SnakeContainerRow key={el.key}>{el} {array[index + 1]}</SnakeContainerRow >])
                  : acc)
                , [])
            }
          </HalfFlexContainerRow>
          <HalfFlexContainerRow>
            <QRPrivacy />
          </HalfFlexContainerRow>
        </StyledSection>
      </section>
    );
  }
}

withRouter(QRCode); // to get history and use history.push

QRCode.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};
