import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { PrimaryButtonNoFill, SecondaryButton } from '../../shared/components/form/base';
import { Heading, Heading2, Link as HyperLink } from '../../shared/components/text/base';
import { FlexContainerCol, FlexContainerRow } from '../../shared/components/layout/base';
import confused from '../../shared/assets/icons/faces/confused.svg';
import happy from '../../shared/assets/icons/faces/happy.svg';
import sad from '../../shared/assets/icons/faces/sad.svg';
import { CbAdmin, ErrorUtils } from '../../api';

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

const ButtonLeft = PrimaryButtonNoFill.extend`
  width: 14rem;
  height: 11rem;
`;

const ButtonRight = SecondaryButton.extend`
  width: 14rem;
  height: 11rem;
`;

const FeedbackButton = PrimaryButtonNoFill.extend`
  flex: 1;
  padding: 1rem;
  border: none;
`;

const FeedbackStyledSection = styled.section`
  width: 60%;
  margin: 0 auto;
`;

const postFeedback = (feedbackScore, props) =>
  CbAdmin.postFeedback(localStorage.getItem('token'), { feedbackScore })
    .then(() => props.history.push('/thankyou'))
    .catch((error) => {
      const status = ErrorUtils.getErrorStatus(error);
      if (status === 401) {
        props.history.push('/login');
      } else {
        props.history.push(`/error/${status}`);
      }
    });

export default props => (
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
          <ButtonLeft large>Sign in with QR code</ButtonLeft>
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
  </div>
);
