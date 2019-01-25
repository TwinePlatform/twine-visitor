import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { PrimaryButtonNoFill, SecondaryButton } from '../../shared/components/form';


const BtnOne = styled(PrimaryButtonNoFill)`
  width: 100%;
  height: 100%;
  padding: 2em 0;
`;

const BtnTwo = styled(SecondaryButton)`
  width: 100%;
  height: 100%;
  padding: 2em 0;
`;

const ActivitiesGridItem = props => (
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

ActivitiesGridItem.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

ActivitiesGridItem.defaultProps = {
  onClick: () => {},
};

export default ActivitiesGridItem;
