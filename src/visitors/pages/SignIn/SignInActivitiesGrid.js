import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Row, Col } from 'react-flexbox-grid';
import SignInActivitiesGridItem from './SignInActivitiesGridItem';
import { pairs } from '../../../util';


const MarginSpacedCol = styled(Col)`
  margin: 1em 0;
`;

const SignInActivitiesGrid = props => (
  <>
    {
      pairs(props.activities)
        .map(([actLeft, actRight], i) => (
          <Row key={`${actLeft.id}${actRight && actRight.id}`} reverse={i % 2 === 0} middle="xs">
            <MarginSpacedCol xs={6}>
              <SignInActivitiesGridItem
                key={actLeft.id}
                index={1}
                name={actLeft.name}
                onClick={props.onClick}
              />
            </MarginSpacedCol>
            {
              actRight && (
                <MarginSpacedCol xs={6}>
                  <SignInActivitiesGridItem
                    key={actRight.id}
                    index={2}
                    name={actRight.name}
                    onClick={props.onClick}
                  />
                </MarginSpacedCol>
              )
            }
          </Row>
        ))
    }
  </>
);

SignInActivitiesGrid.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.number, name: PropTypes.string }),
  ).isRequired,
  onClick: PropTypes.func.isRequired,
};

SignInActivitiesGrid.defaultProps = {};

export default SignInActivitiesGrid;
