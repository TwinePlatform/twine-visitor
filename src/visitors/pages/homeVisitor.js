import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Grid, Row as R, Col } from 'react-flexbox-grid';
import { PrimaryButtonNoFill, SecondaryButton } from '../../shared/components/form/base';
import { Heading2 } from '../../shared/components/text/base';
import NavHeader from '../../shared/components/NavHeader';
import FeedbackButtons from '../components/FeedbackButtons';
import { CommunityBusiness, CbAdmin } from '../../api';
import { redirectOnError } from '../../util';


const Row = styled(R)`
  padding: 2em 0;
`;

const ButtonLeft = styled(PrimaryButtonNoFill)`
  width: 100%;
  height: 11rem;
  max-width: 14rem;
`;

const ButtonRight = styled(SecondaryButton)`
  width: 100%;
  height: 11rem;
  max-width: 14rem;
`;

const postFeedback = (feedbackScore, props) =>
  CommunityBusiness.postFeedback(feedbackScore)
    .then(() => props.history.push('/visitor/thankyou'))
    .catch(err => redirectOnError(props.history.push, err));

export default class HomeVisitor extends Component {

  componentDidMount() {
    CbAdmin.downgradePermissions()
      .catch(err => redirectOnError(this.props.history.push, err));
  }

  render() {
    return (
      <Grid>
        <NavHeader
          leftTo="/"
          leftContent="Back to main page"
          centerContent="Welcome, visitor!"
        />
        <Row around="xs" center="xs">
          <Col xs={4}>
            <Link to="/visitor/login">
              <ButtonLeft>Sign in</ButtonLeft>
            </Link>
          </Col>
          <Col xs={4}>
            <Link to="/visitor/signup">
              <ButtonRight>Sign up as a new visitor</ButtonRight>
            </Link>
          </Col>
        </Row>
        <Row center="xs" middle="xs">
          <Heading2>What did you think of your visit today?</Heading2>
        </Row>
        <FeedbackButtons onClick={score => postFeedback(score, this.props)} />
      </Grid>
    );
  }
}

HomeVisitor.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
