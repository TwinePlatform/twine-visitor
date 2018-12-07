import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { colors } from '../../style_guide';

const CheckboxDiv = styled.div`
  cursor: pointer;
  margin-bottom: 0.5em;
  & input {
    z-index: -1;
    opacity: 0;
    position: absolute;
  }

  & input + label:before {
    content: '';
    display: inline-block;
    height: 1.5em;
    width: 1.5em;
    border-radius: 50%;
    border: 0.2em solid ${colors.highlight_primary};
    background: transparent;
    position: relative;
  }

  & input:checked + label:before {
    background: ${colors.highlight_primary};
  }
`;
const Input = styled.input``;
const Label = styled.label``;

const Checkbox = ({ id, onChange, ...props }) => (
  <CheckboxDiv>
    <Input id={id} type="checkbox" onChange={onChange} {...props} />
    <Label htmlFor={id} />
  </CheckboxDiv>
);

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};

Checkbox.defaultProps = {
  onChange: () => {},
};

export default Checkbox;
