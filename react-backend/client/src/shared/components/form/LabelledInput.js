/*
 * Labelled Input component
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Input, Label } from './base';


const LabelledInput = (props) => {
  const { id, label, ...rest } = props;

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...rest} />
    </div>
  );
};


LabelledInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
};


export default LabelledInput;
