import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Row, Col } from 'react-flexbox-grid';
import { PrimaryButtonNoFill } from '../../shared/components/form/base';
import confused from '../../shared/assets/icons/faces/confused.svg';
import happy from '../../shared/assets/icons/faces/happy.svg';
import sad from '../../shared/assets/icons/faces/sad.svg';


const FeedbackButton = styled(PrimaryButtonNoFill)`
  flex: 1;
  padding: 1rem;
  margin: 0 1rem;
  border: none;
`;

const Img = styled.img`
  height: 7em;
`;

const FeedbackButtons = ({ onClick }) => (
  <Row center="xs" middle="xs">
    <Col>
      <FeedbackButton data-testid="negative-feedback-btn" onClick={() => onClick(-1)}>
        <Img src={sad} alt="sad feedback button" />
      </FeedbackButton>
    </Col>
    <Col>
      <FeedbackButton data-testid="neutral-feedback-btn" onClick={() => onClick(0)}>
        <Img src={confused} alt="confused feedback button" />
      </FeedbackButton>
    </Col>
    <Col>
      <FeedbackButton data-testid="positive-feedback-btn" onClick={() => onClick(1)}>
        <Img src={happy} alt="happy feedback button" />
      </FeedbackButton>
    </Col>
  </Row>
);

FeedbackButtons.propTypes = {
  onClick: PropTypes.func,
};

FeedbackButtons.defaultProps = {
  onClick: () => {},
};

export default FeedbackButtons;
