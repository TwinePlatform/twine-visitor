/*
 * Labelled Input component
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Input, Label } from './base';


const LabelledInput = (props) => {
  const { id, label, error, ...rest } = props;

  const labelContent = error
    ? `${label}: ${error}`
    : label;

  return (
    <div>
      <Label htmlFor={id}>{labelContent}</Label>
      <Input id={id} {...rest} />
    </div>
  );
};


LabelledInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  error: PropTypes.string,
};

LabelledInput.defaultProps = {
  error: null,
};


export default styled(LabelledInput)`
  margin-bottom: 1em;
`;
