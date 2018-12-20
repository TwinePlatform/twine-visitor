/*
 *           ---- Scan QR code ---                       ---- Load activities ---- Register visit
 *          /                     \                    /
 * Login --                        -- Get visitor ID --
 *          \                     /                    \
 *           --- Enter details ---                        ---- Failure screen
 */
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import styled from 'styled-components';
import { Row, Col, Grid } from 'react-flexbox-grid';
import QRPrivacy from '../components/qrprivacy';
import QrScanner from '../components/QrScanner';
import SignInForm from '../components/SignInForm';
import ActivitiesGrid from '../components/ActivitiesGrid';
import { Activities, Visitors, CbAdmin, CommunityBusiness } from '../../api';
import { Heading, Paragraph } from '../../shared/components/text/base';
import { PrimaryButton } from '../../shared/components/form/base';
import NavHeader from '../../shared/components/NavHeader';
import { redirectOnError } from '../../util';


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

const capitaliseFirstName = name => name.split(' ')[0].replace(/\b\w/g, l => l.toUpperCase());
const greetingWithOrgName = orgName => `Welcome${orgName ? ` to ${orgName}` : ''}!`;

export default class Login extends Component {
  constructor() {
    super();

    this.state = {
      initialFetchDone: false,
      hasScanned: false,
      visitorId: null,
      visitorName: '',
      orgName: '',
      qrCodeContent: '',
      activities: [],
      errors: {},
    };
  }

  componentDidMount() {
    CbAdmin.downgradePermissions()
      .then(() => Promise.all([
        Activities.get({ day: 'today' }),
        CommunityBusiness.get({ fields: ['name'] }),
      ]))
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
    this.setState(res);
  }

  onSignInFailure = () => {
    this.props.history.push('/visitor/qrerror?e=no_user');
  }

  searchVisitorByQrCode = (content) => {
    Visitors.search({ qrCode: content })
      .then((res) => {
        if (!res.data.result) {
          throw new SignInForm.NoUserError('No user found');
        }

        return {
          visitorName: res.data.result.name,
          visitorId: res.data.result.id,
          qrCodeContent: content,
          hasScanned: true,
        };
      })
      .catch(err => redirectOnError(this.props.history.push, err, { default: '/visitor/qrerror' }));
  }

  searchVisitorByDetails = filter =>
    Visitors.get(null, { filter, fields: ['id', 'name'] })
      .then(
        (res) => {
          if (!res.data.result || res.data.result.length === 0) {
            throw new SignInForm.NoUserError('No user found');
          }

          if (res.data.result.length !== 1) {
            throw new SignInForm.MultipleUserError('Multiple users found');
          }

          return {
            visitorName: res.data.result[0].name,
            visitorId: res.data.result[0].id,
            hasScanned: true,
          };
        },
        err => redirectOnError(this.props.history.push, err, { default: '/visitor/qrerror' }),
      )

  submitVisitorName = ({ name }) =>
    this.searchVisitorByDetails({ name })

  submitVisitorBirthYear = ({ name, birthYear }) =>
    this.searchVisitorByDetails({
      name,
      age: birthYear ? [1, 1].map(() => moment().year() - birthYear) : undefined,
    })

  submitVisitorEmail = ({ name, birthYear, email }) =>
    this.searchVisitorByDetails({
      name,
      age: birthYear ? [1, 1].map(() => moment().year() - birthYear) : undefined,
      email,
    })

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
    return (
      <Fragment>
        <NavHeader
          leftContent={'Back to the main page'}
          leftTo={'/'}
          centerContent={greetingWithOrgName(this.state.orgName)}
          centerFlex={2}
        />
        <Grid>
          <Row center="xs">
            <Col xs={12}>
              Please select how you would like to log in
            </Col>
          </Row>
          <Row center="xs">
            <Col xs={12} md={6}>
              <QrScanner
                onCameraError={this.onCameraError}
                onScannerError={this.onScannerError}
                onScan={this.searchVisitorByQrCode}
              />
            </Col>
            <Col xs={12} md={6}>
              <SignInForm
                onStepOneSubmit={this.submitVisitorName}
                onStepTwoSubmit={this.submitVisitorBirthYear}
                onStepThreeSubmit={this.submitVisitorEmail}
                onSuccess={this.onSignInSuccess}
                onFailure={this.onSignInFailure}
              />
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
        <Grid>
          <Row>
            <Col xs={12} md={6}>
              <ActivitiesGrid
                activities={this.state.activities}
                onClick={this.addVisitLog}
              />
            </Col>
            <Col xs={12} md={6}>
              <QRPrivacy />
            </Col>
          </Row>
        </Grid>
      </Fragment>
    );
  }

  renderNoActivities() {
    return (
      <Fragment>
        <NavHeader
          centerContent={`Welcome${this.state.orgName ? ` to ${this.state.orgName}` : ''}!`}
          centerFlex={2}
        />
        <StyledSection margin={3}>
          <Paragraph>
            There are no activities scheduled today.
          </Paragraph>
          <PrimaryButton onClick={() => this.props.history.push('/')}>Go back</PrimaryButton>
        </StyledSection>
      </Fragment>
    );
  }

  renderLoader = () => (
    <Grid fluid className="full-height">
      <Row center="xs" middle="xs" className="full-height">
        <Col xs={12}>
          <Heading>Loading</Heading>
        </Col>
      </Row>
    </Grid>
  )

  render() {
    const { hasScanned, activities, initialFetchDone } = this.state;

    if (!initialFetchDone) {
      return this.renderLoader();
    }

    if ((!activities) || activities.length === 0) {
      return this.renderNoActivities();
    }

    return !hasScanned
      ? this.renderSignInPage()
      : this.renderActivitySelect();
  }
}

withRouter(Login); // to get history and use history.push

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};
