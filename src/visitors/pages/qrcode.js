/*
 * NOTE: The "Enter name" path has been removed temporarily -- see https://github.com/TwinePlatform/twine-visitor/issues/562
 *           ---- Scan QR code ---                       ---- Load activities ---- Register visit
 *          /                     \                    /
 * Login --                        -- Get visitor ID --
 *          \                     /                    \
 *           ---- Enter name ----                        ---- Failure screen
 */
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import styled from 'styled-components';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { BeatLoader as Bl } from 'react-spinners';
import PurposeButton from '../components/purposeButton';
import QRPrivacy from '../components/qrprivacy';
import QrScanner from '../components/QrScanner';
import { Activities, Visitors } from '../../api';
import { FlexContainerRow } from '../../shared/components/layout/base';
import NavHeader from '../../shared/components/NavHeader';
import { redirectOnError } from '../../util';
import { Paragraph as P } from '../../shared/components/text/base';
import { PrimaryButton } from '../../shared/components/form/base';
import { colors } from '../../shared/style_guide';


const Button = styled(PrimaryButton)`
  padding: 1em;
`;

const Paragraph = styled(P)`
  margin-top: 20vh;
  margin-bottom: 3em;
`;

const StyledSection = styled.section`
  margin: ${props => props.margin}rem 0;
  display: flex;
  justify-content: center;
`;

const BigFlexContainerRow = styled(FlexContainerRow)`
  width: 60%;
  padding: 1rem;
  flex-wrap: wrap;
  @media (min-width: 1000px) {
    width: 50%;
  }
`;

const SmallFlexContainerRow = styled(FlexContainerRow)`
  width: 40%;
  padding: 1rem;
  flex-wrap: wrap;
  @media (min-width: 1000px) {
    width: 50%;
  }
`;

const SnakeContainerRow = styled(FlexContainerRow)`
  width: 100%;
  justify-content: space-between;
  &:nth-child(2n) {
    flex-direction: row-reverse;
  }
`;

const BeatLoader = styled(Bl)`
  width: 60px;
  margin: 0 auto;
  padding-top: 5rem;
`;

const capitaliseFirstName = name => name.split(' ')[0].replace(/\b\w/g, l => l.toUpperCase());

export default class QRCode extends Component {
  constructor() {
    super();

    this.state = {
      isFetching: true,
      hasScanned: false,
      visitorId: null,
      visitorName: '',
      qrCodeContent: '',
      activities: [],
      form: { name: null },
      errors: {},
    };
  }

  componentDidMount() {
    Activities.get({ day: 'today' })
      .then((res) => {
        this.setState({ activities: res.data.result, isFetching: false });
      })
      .catch(error => redirectOnError(this.props.history.push, error));
  }

  onCameraError() {
    this.props.history.push('/visitor/qrerror?e=camera');
  }

  onScannerError() {
    this.props.history.push('/visitor/qrerror?e=scanner');
  }

  onScan = content =>
    Visitors.search({ qrCode: content })
      .then((res) => {
        if (!res.data.result) {
          return this.props.history.push('/visitor/qrerror?e=no_user');
        }

        return this.setState({
          visitorName: res.data.result.name,
          visitorId: res.data.result.id,
          qrCodeContent: content,
          hasScanned: true,
        });
      })
      .catch((err) => {
        console.log(err);
        this.props.history.push('/visitor/qrerror');
      })

  handleFormChange = (e) => {
    this.setState({ form: { [e.target.name]: e.target.value } });
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
      .catch((error) => {
        console.log('ERROR @ Visitors.createVisit', error);
        this.props.history.push('/error/500');
      });
  }

  renderLoader = () => (
    <BeatLoader
      color={colors.highlight_primary}
      sizeUnit={'px'}
      size={15}
    />
  )

  renderQrScanner() {
    return (
      <Fragment>
        <NavHeader
          leftTo="/"
          leftContent="Back to main page"
          centerContent="Welcome, visitor!"
        />
        <StyledSection margin={0}>
          <QrScanner
            onCameraError={this.onCameraError}
            onScannerError={this.onScannerError}
            onScan={this.onScan}
          />
        </StyledSection>
      </Fragment>
    );
  }

  renderActivities() {
    const { activities, visitorName } = this.state;

    const activityBtns = activities
      .map((activity, index) => (
        <PurposeButton
          key={activity.id}
          color={index}
          session={activity.name}
          onClick={this.addVisitLog}
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
      );

    return (
      <Fragment>
        <NavHeader
          centerContent={`Welcome back, ${capitaliseFirstName(visitorName)}! Why are you here today?`}
        />
        <StyledSection margin={3}>
          <BigFlexContainerRow>
            { activityBtns }
          </BigFlexContainerRow>
          <SmallFlexContainerRow>
            <QRPrivacy />
          </SmallFlexContainerRow>
        </StyledSection>
      </Fragment>
    );
  }

  renderNoActivities = () => (
    <Fragment>
      <NavHeader
        centerContent={'No activities scheduled!'}
      />
      <StyledSection margin={3}>
        <Grid>
          <Row center="xs">
            <Col xs={12}>
              <Paragraph>There are no activities scheduled for today.</Paragraph>
            </Col>
          </Row>
          <Row center="xs">
            <Col xs={12}>
              <Link to="/visitor/home">
                <Button>Go back</Button>
              </Link>
            </Col>
          </Row>
        </Grid>
      </StyledSection>
    </Fragment>
  )

  render() {
    const { hasScanned, isFetching, activities } = this.state;

    if (isFetching) {
      return this.renderLoader();
    }

    if (!hasScanned && activities.length > 0) {
      return this.renderQrScanner();
    }

    return (
      activities.length === 0
        ? this.renderNoActivities()
        : this.renderActivities()
    );
  }
}

withRouter(QRCode); // to get history and use history.push

QRCode.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};
