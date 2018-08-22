/* global Instascan */
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import PurposeButton from '../components/purposeButton';
import QRPrivacy from '../components/qrprivacy';
import { Activities, Visitors } from '../../api';
import { Heading, Paragraph, Link as HyperLink } from '../../shared/components/text/base';
import { FlexContainerRow, FlexContainerCol } from '../../shared/components/layout/base';

const StyledNav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledSection = styled.section`
  margin: ${props => props.margin}rem 0;
  display: flex;
  justify-content: center;
`;

const BigFlexContainerRow = FlexContainerRow.extend`
  width: 60%;
  padding: 1rem;
  flex-wrap: wrap;
  @media (min-width: 1000px) {
    width: 50%;
  }
`;

const SmallFlexContainerRow = FlexContainerRow.extend`
  width: 40%;
  padding: 1rem;
  flex-wrap: wrap;
  @media (min-width: 1000px) {
    width: 50%;
  }
`;

const FlexItem = styled.div`
  flex: ${props => props.flex || '1'};
`;

const QrParagraph = Paragraph.extend`
  text-align: center;
  margin-bottom: 3rem;
`;

const SnakeContainerRow = FlexContainerRow.extend`
  width: 100%;
  justify-content: space-between;
  &:nth-child(2n) {
    flex-direction: row-reverse;
  }
`;

const capitaliseFirstName = name => name.split(' ')[0].replace(/\b\w/g, l => l.toUpperCase());

export default class QRCode extends Component {
  constructor() {
    super();

    this.state = {
      hasScanned: false,
      username: '',
      hash: '',
      activity: 'not selected',
      activities: [],
    };

    this.changeActivity = this.changeActivity.bind(this);

    this.scanner = null;
    this.previewDiv = null;

    this.previewRef = (element) => {
      this.previewDiv = element;
    };
  }

  componentDidMount() {
    this.scanner = this.scanner || new Instascan.Scanner({ video: this.previewDiv, scanPeriod: 5 });

    Instascan.Camera.getCameras()
      .then((cameras) => {
        if (cameras.length < 1) {
          throw new Error('No accessible cameras');
        }
        this.scanner.start(cameras[0]);
      })
      .catch((err) => {
        console.log(err);
        this.props.history.push('/visitor/qrerror');
      });

    if (!this.state.hasScanned) {
      this.scanner.addListener('scan', (content) => {
        this.scanner.stop();

        Visitors.get({ hash: content })
          .then((res) => {
            this.setState({
              username: res.data.fullname,
              hash: res.data.hash,
              hasScanned: true,
            });
          })
          .catch((err) => {
            console.log(err);
            this.props.history.push('/visitor/qrerror');
          });
      });
    }

    Activities.get({ weekday: 'today' })
      .then((res) => {
        this.setState({ activities: res.data.activities });
      })
      .catch((error) => {
        console.log('ERROR HAPPENING AT FETCH', error);
        this.props.history.push('/visitor/qrerror');
      });
  }

  componentWillUnmount() {
    if (this.scanner) {
      this.scanner.stop()
        .then(() => {
          this.scanner = null;
        });
    }
  }

  changeActivity = (newActivity) => {
    this.setState({ activity: newActivity });

    Visitors.createVisit({
      hash: this.state.hash,
      activity: newActivity,
    })
      .then(() => this.props.history.push('/visitor/end'))
      .catch((error) => {
        console.log('ERROR HAPPENING AT FETCH /api/visit/add', error);
        this.props.history.push('/visitor/login');
      });
  };

  render() {
    if (!this.state.hasScanned) {
      return (
        <Fragment>
          <StyledNav>
            <FlexItem>
              <HyperLink to="/">Back to the main page</HyperLink>
            </FlexItem>
            <FlexItem flex="2">
              <Heading>Welcome Visitor!</Heading>
            </FlexItem>
            <FlexItem />
          </StyledNav>
          <StyledSection margin={0}>
            <FlexContainerCol>
              <QrParagraph>Please scan your QR code to log in</QrParagraph>
              <div>
                <video ref={this.previewRef} />
              </div>
            </FlexContainerCol>
          </StyledSection>
        </Fragment>
      );
    }
    return (
      <Fragment>
        <StyledNav>
          <Heading>
            Welcome back, {capitaliseFirstName(this.state.username)}! Why are you here today?
          </Heading>
        </StyledNav>
        <StyledSection margin={3}>
          <BigFlexContainerRow>
            {this.state.activities
              .map((activity, index) => (
                <PurposeButton
                  key={activity.name}
                  color={index}
                  session={activity.name}
                  activity={this.state.activity}
                  onClick={this.changeActivity}
                />
              ))
              .reduce(
                (acc, el, index, array) =>
                  (index % 2 === 0
                    ? acc.concat([
                      <SnakeContainerRow key={el.key}>
                        {el} {array[index + 1]}
                      </SnakeContainerRow>,
                    ])
                    : acc),
                [],
              )}
          </BigFlexContainerRow>
          <SmallFlexContainerRow>
            <QRPrivacy />
          </SmallFlexContainerRow>
        </StyledSection>
      </Fragment>
    );
  }
}

withRouter(QRCode); // to get history and use history.push

QRCode.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};
