/*
 * Labelled Input component
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Input, Label } from './base';

const CheckboxDiv = styled.div`
width: 25px;
height: 25px;
background: #FDBD2D;
border-radius: 100%;
`;

const CheckboxLabel = Label.extend`
display: block;
width: 15px;
height: 15px;
border-radius: 100%;
-webkit-transition: all .5s ease;
-moz-transition: all .5s ease;
-o-transition: all .5s ease;
-ms-transition: all .5s ease;
transition: all .5s ease;
cursor: pointer;
z-index: 1;
position: relative;
top: 5px;
left: 5px;
background: ${props => (props.checked ? 'inherited' : '#FFFFFF')};
`;

const InputCheckbox = Input.extend`
visibility: hidden;
width: 30%;
`;

const StyledLabelledCheckbox = (props) => {
  const { id, checked, ...rest } = props;
  let isChecked = false;

  return (
    <CheckboxDiv>
      <CheckboxLabel for={id} checked={isChecked} />
      <InputCheckbox type="checkbox" id={id} onChange={(e) => { isChecked = e.target.checked; }} {...rest} />
    </CheckboxDiv>
  );
};


StyledLabelledCheckbox.propTypes = {
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
};

StyledLabelledCheckbox.defaultProps = {
  error: null,
};


export default styled(StyledLabelledCheckbox)`
  margin-bottom: 1em;
`;
