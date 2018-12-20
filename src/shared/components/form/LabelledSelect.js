/*
 * Labelled Select component
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Select, SelectWrapper, Option, Label } from './base';

const LabelledSelectContainer = styled.div`
  width: 100%;
`;

const LabelledSelect = (props) => {
  const { id, label, options, ...rest } = props;

  const SelectArrow = styled.div`
    float: right;
    margin-top: -1em;
    width: 0;
    pointer-events: none;
    border-width: 8px 5px 0 5px;
    border-style: solid;
    border-color: #7b7b7b transparent transparent transparent;
  `;

  return (
    <LabelledSelectContainer>
      <Label htmlFor={id}>{label}</Label>
      <SelectWrapper>
        <Select id={id} {...rest}>
          {options.map(opt => (
            <Option key={opt.key} value={opt.value}>
              {opt.content || opt.value}
            </Option>
          ))}
        </Select>
        <SelectArrow />
      </SelectWrapper>
    </LabelledSelectContainer>
  );
};

LabelledSelect.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]).isRequired,
      value: PropTypes.string.isRequired,
      content: PropTypes.string,
    }),
  ).isRequired,
};

export default LabelledSelect;
