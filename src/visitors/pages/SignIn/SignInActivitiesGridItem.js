import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { PrimaryButtonNoFill, SecondaryButton } from '../../../shared/components/form';


const BtnOne = styled(PrimaryButtonNoFill)`
  width: 100%;
  height: 100%;
  padding: 2em 0;
  min-height: 6em;
`;

const BtnTwo = styled(SecondaryButton)`
  width: 100%;
  height: 100%;
  padding: 2em 0;
  min-height: 6em;
`;

const SignInActivitiesGridItem = props => (
  <>
    {
      props.index % 2 === 0
        ? (
          <BtnOne name={props.name} onClick={e => props.onClick(e.target.name)}>
            {props.name}
          </BtnOne>
        )
        : (
          <BtnTwo name={props.name} onClick={e => props.onClick(e.target.name)}>
            {props.name}
          </BtnTwo>
        )
    }
  </>
);

SignInActivitiesGridItem.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

SignInActivitiesGridItem.defaultProps = {
  onClick: () => {},
};

export default SignInActivitiesGridItem;
