/*
 *           ---- Scan QR code ---                       ---- Load activities ---- Register visit
 *          /                     \                    /
 * Sign in --                      -- Get visitor ID --
 *          \                     /                    \
 *           --- Enter details ---                        ---- Failure screen
 */
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { Row, Col, Grid } from 'react-flexbox-grid';
import { BeatLoader as Bl } from 'react-spinners';
import PrivacyStatement from '../../components/PrivacyStatement';
import QrScanner from './QrScanner';
import SignInForm from './SignInForm';
import SignInActivitiesGrid from './SignInActivitiesGrid';
import { Activities, Visitors, CommunityBusiness } from '../../../api';
import { Paragraph } from '../../../shared/components/text/base';
import { PrimaryButton } from '../../../shared/components/form/base';
import NavHeader from '../../../shared/components/NavHeader';
import { redirectOnError } from '../../../util';
import { colors } from '../../../shared/style_guide';


const TopParagraph = styled(Paragraph)`
  @media only screen and (min-height: 993px) {
    margin-top: 10vh;
  }
`;

const BackButton = styled(PrimaryButton)`
  padding: 2em;
`;

const BeatLoader = styled(Bl)`
  width: 60px;
  margin: 0 auto;
  padding-top: 45vh;
`;

const capitaliseFirstName = name => name.split(' ')[0].replace(/\b\w/g, l => l.toUpperCase());
const greetingWithOrgName = orgName => `Welcome${orgName ? ` to ${orgName}` : ''}!`;

export default class SignIn extends Component {
  constructor() {
    super();

    this.state = {
      initialFetchDone: false,
      hasSignedIn: false,
      visitorId: null,
      visitorName: '',
      orgName: '',
      qrCodeContent: '',
      activities: [],
      errors: {},
    };
  }

  componentDidMount() {
    Promise.all([
      Activities.get({ day: 'today' }),
      CommunityBusiness.get({ fields: ['name'] }),
    ])
      .then(([resA, resC]) => {
        this.setState({
          initialFetchDone: true,
          activities: resA.data.result,
          orgName: resC.data.result.name,
        });
      })
      .catch(error => redirectOnError(this.props.history.push, error));
  }

  onCameraError = () => {
    this.props.history.push('/visitor/qrerror?e=camera');
  }

  onScannerError = () => {
    this.props.history.push('/visitor/qrerror?e=scanner');
  }

  onSignInSuccess = (res) => {
    this.setState({
      hasSignedIn: true,
      visitorName: res.name,
      visitorId: res.id,
      qrCodeContent: res.qrCodeContent,
    });
  }

  onSignInFailure = () => {
    this.props.history.push('/visitor/qrerror?e=no_user');
  }

  searchVisitorByQrCode = (content) => {
    Visitors.search({ qrCode: content })
      .then((res) => {
        if (!res.data.result) {
          return this.props.history.push('/visitor/qrerror?e=no_user_qr');
        }

        return this.onSignInSuccess({
          ...res.data.result,
          qrCodeContent: content,
        });
      })
      .catch(err => redirectOnError(this.props.history.push, err, { default: '/visitor/qrerror' }));
  }

  addVisitLog = (newActivity) => {
    const activity = this.state.activities.find(a => a.name === newActivity);

    if (!activity) {
      // TODO: Do something better here
      console.log('Activity not recognised');
      this.props.history.push('/error/unknown');
    }

    Visitors.createVisit({
      activityId: activity.id,
      visitorId: this.state.visitorId,
    })
      .then(() => this.props.history.push('/visitor/end'))
      .catch(err => redirectOnError(this.props.history.push, err));
  }

  renderSignInPage() {
    const colProps = Object.assign({ xs: 12 }, window.innerHeight > 1024 ? { xl: 6 } : { lg: 6 });

    return (
      <Fragment>
        <NavHeader
          leftContent={'Back to the main page'}
          leftTo={'/'}
          centerContent={greetingWithOrgName(this.state.orgName)}
          centerFlex={2}
        />
        <Grid fluid>
          <Row center="xs">
            <TopParagraph style={{ marginBottom: '2em' }}>
              Use one of the two options below to sign in!
            </TopParagraph>
          </Row>
          <Row center="xs">
            <Col {...colProps}>
              <Row center="xs">
                <Col xs={12}>
                  <Paragraph> Either scan your QR code </Paragraph>
                </Col>
              </Row>
              <QrScanner
                onCameraError={this.onCameraError}
                onScannerError={this.onScannerError}
                onScan={this.searchVisitorByQrCode}
              />
            </Col>
            <Col {...colProps}>
              <Row center="xs">
                <Col xs={12}>
                  <Paragraph> Or, please enter the details you signed up with </Paragraph>
                </Col>
              </Row>
              <Row center="xs">
                <SignInForm
                  onSuccess={this.onSignInSuccess}
                  onFailure={this.onSignInFailure}
                />
              </Row>
            </Col>
          </Row>
        </Grid>
      </Fragment>
    );
  }

  renderActivitySelect() {
    const { visitorName: name } = this.state;
    return (
      <Fragment>
        <NavHeader
          centerContent={`Welcome back, ${capitaliseFirstName(name)}! Why are you here today?`}
          centerFlex={2}
        />
        <Grid fluid>
          <Row>
            <Col xs={12} md={6}>
              <SignInActivitiesGrid
                activities={this.state.activities}
                onClick={this.addVisitLog}
              />
            </Col>
            <Col xs={12} md={5} mdOffset={1}>
              <PrivacyStatement />
            </Col>
          </Row>
        </Grid>
      </Fragment>
    );
  }

  renderNoActivities() {
    return (
      <Grid fluid style={{ height: '100vh' }}>
        <NavHeader
          centerContent={`Welcome${this.state.orgName ? ` to ${this.state.orgName}` : ''}!`}
        />
        <Grid>
          <Row center="xs" middle="xs">
            <Col xs={12}>
              <Paragraph> There are no activities scheduled today. </Paragraph>
            </Col>
            <Col xs={12}>
              <BackButton onClick={() => this.props.history.push('/')}>Go back</BackButton>
            </Col>
          </Row>
        </Grid>
      </Grid>
    );
  }

  renderLoader = () => (
    <Grid fluid>
      <Row center="xs" middle="xs">
        <Col xs={12}>
          <BeatLoader
            color={colors.highlight_primary}
            sizeUnit={'px'}
            size={15}
          />
        </Col>
      </Row>
    </Grid>
  )

  render() {
    const { hasSignedIn, activities, initialFetchDone } = this.state;

    if (!initialFetchDone) {
      return this.renderLoader();
    }

    if ((!activities) || activities.length === 0) {
      return this.renderNoActivities();
    }

    return !hasSignedIn
      ? this.renderSignInPage()
      : this.renderActivitySelect();
  }
}

withRouter(SignIn); // to get history and use history.push

SignIn.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
    location: PropTypes.shape({
      search: PropTypes.string,
    }),
  }).isRequired,
};
