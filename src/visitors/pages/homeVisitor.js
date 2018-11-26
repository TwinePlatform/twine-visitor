import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { PrimaryButtonNoFill, SecondaryButton } from '../../shared/components/form/base';
import { Heading, Heading2, Link as HyperLink } from '../../shared/components/text/base';
import { FlexContainerCol, FlexContainerRow } from '../../shared/components/layout/base';
import confused from '../../shared/assets/icons/faces/confused.svg';
import happy from '../../shared/assets/icons/faces/happy.svg';
import sad from '../../shared/assets/icons/faces/sad.svg';
import { CommunityBusiness, ErrorUtils, CbAdmin } from '../../api';

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

const FlexLink = styled(Link)`
  flex: 1 0 20vh;
  text-align: center;
`;

const FlexItem = styled.div`
  flex: ${props => props.flex || '1'};
  text-align: ${props => (props.textRight ? 'right' : 'left')};
`;

const ButtonLeft = styled(PrimaryButtonNoFill)`
  width: 14rem;
  height: 11rem;
`;

const ButtonRight = styled(SecondaryButton)`
  width: 14rem;
  height: 11rem;
`;

const FeedbackButton = styled(PrimaryButtonNoFill)`
  flex: 1;
  padding: 1rem;
  border: none;
`;

const FeedbackStyledSection = styled.section`
  width: 60%;
  margin: 0 auto;
`;

const postFeedback = (feedbackScore, props) =>
  CommunityBusiness.postFeedback(feedbackScore)
    .then(() => props.history.push('/thankyou'))
    .catch((error) => {
      if (ErrorUtils.errorStatusEquals(error, 401)) {
        props.history.push('/cb/login');
      } else {
        props.history.push(`/error/${ErrorUtils.getErrorStatus(error)}`);
      }
    });

export default class HomeVisitor extends Component {

  componentDidMount() {
    CbAdmin.downgradePermissions()
      .catch((error) => {
      // on first load this redirects to login if bad/no cookie is present

        if (ErrorUtils.errorStatusEquals(error, 401) || ErrorUtils.errorStatusEquals(error, 403)) {
          this.props.history.push('/cb/login');

        } else if (ErrorUtils.errorStatusEquals(error, 500)) {
          this.props.history.push('/error/500');

        } else if (ErrorUtils.errorStatusEquals(error, 404)) {
          this.props.history.push('/error/404');

        } else {
          this.props.history.push('/error/unknown');
        }
      });
  }

  render() {
    const { props } = this;
    return (
      <div>
        <FlexContainerCol justify="space-around">
          <StyledNav>
            <FlexItem>
              <HyperLink to="/">Back to the main page</HyperLink>
            </FlexItem>
            <FlexItem flex="2">
              <Heading>Welcome Visitor</Heading>
            </FlexItem>
            <FlexItem />
          </StyledNav>
          <StyledSection>
            <FlexLink to="/visitor/login">
              <ButtonLeft large>Sign in</ButtonLeft>
            </FlexLink>
            <FlexLink to="/visitor/signup">
              <ButtonRight large>Sign up</ButtonRight>
            </FlexLink>
          </StyledSection>
          <FeedbackStyledSection>
            <Heading2>What did you think of your visit today?</Heading2>
            <FlexContainerRow>
              <FeedbackButton data-testid="negative-feedback-btn" onClick={() => postFeedback(-1, props)}>
                <img src={sad} alt="sad feedback button" />
              </FeedbackButton>
              <FeedbackButton data-testid="neutral-feedback-btn" onClick={() => postFeedback(0, props)}>
                <img src={confused} alt="confused feedback button" />
              </FeedbackButton>
              <FeedbackButton data-testid="positive-feedback-btn" onClick={() => postFeedback(+1, props)}>
                <img src={happy} alt="happy feedback button" />
              </FeedbackButton>
            </FlexContainerRow>
          </FeedbackStyledSection>
        </FlexContainerCol>
      </div>)
    ;
  }
}

HomeVisitor.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
