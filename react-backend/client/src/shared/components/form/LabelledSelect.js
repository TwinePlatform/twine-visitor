/*
 * Labelled Select component
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Select, Option, Label } from './base';


const LabelledSelect = (props) => {
  const { id, label, options, ...rest } = props;

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Select id={id} {...rest}>
        {
          options.map(opt =>
            (<Option key={opt.key} value={opt.value}>
              {opt.content || opt.value}
            </Option>),
          )
        }
      </Select>
    </div>
  );
};


LabelledSelect.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    content: PropTypes.string,
  })).isRequired,
};


export default styled(LabelledSelect)`
  margin-bottom: 1em;
`;
