/*
 * Custom-styled checkbox
 *
 * Adapted from:
 * https://medium.com/@colebemis/building-a-checkbox-component-with-react-and-styled-components-8d3aa1d826dd
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { hideVisually } from 'polished';
import { colors } from '../../style_guide';


const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  ${hideVisually()}
`;

const StyledCheckbox = styled.div`
  display: inline-block;
  width: 2rem;
  height: 2rem;
  background: ${props => props.checked ? colors.highlight_primary : colors.light}
  border-radius: 1rem;
  transition: all 300ms;

  ${HiddenCheckbox}:focus + & {
    box-shadow: 0 0 0 5px ${colors.highlight_primary};
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  margin-top: 1em;
  cursor: pointer;
`;

const LabelText = styled.span`
  line-height: 2rem;
  padding-left: 0.5rem;
`;

const Checkbox = ({ checked, label, onChange, ...props }) => (
  <CheckboxContainer onClick={() => onChange({ target: { name: props.name, value: !checked } })}>
    <HiddenCheckbox checked={checked} onChange={() => {}} {...props} />
    <StyledCheckbox checked={checked} />
    <LabelText>{label}</LabelText>
  </CheckboxContainer>
);

Checkbox.propTypes = {
  checked: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
};

Checkbox.defaultProps = {
  checked: false,
  label: null,
  name: '',
  onChange: () => {},
};

export default Checkbox;
