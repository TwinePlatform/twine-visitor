import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { colors } from '../../shared/style_guide';

const Control = styled.div`
  cursor: pointer;

  & input {
    z-index: -1;
    opacity: 0;
  }

  & input + label:before {
    content: '';
    display: inline-block;
    height: 1.5em;
    width: 1.5em;
    border-radius: 50%;
    border: 0.1em solid ${colors.light};
    background: transparent;
  }

  & input:checked + label:before {
    background: ${colors.highlight_primary};
  }
`;
const Input = styled.input``;
const Label = styled.label``;


const Checkbox = ({ id, onChange, ...props }) => (
  <Control>
    <Input id={id} type="checkbox" onChange={onChange} {...props} />
    <Label htmlFor={id} />
  </Control>
);

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};

Checkbox.defaultProps = {
  onChange: () => {},
};

export default Checkbox;
