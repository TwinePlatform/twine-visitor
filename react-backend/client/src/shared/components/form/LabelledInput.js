/*
 * Labelled Input component
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Input, Label } from './base';
import { colors } from '../../style_guide';


const ErrorText = styled.span`
  color: ${colors.error};
`;


const LabelledInput = (props) => {
  const { id, label, error, ...rest } = props;

  return (
    <div>
      <Label htmlFor={id}>
        {[
          label,
          error ? ': ' : '',
          <ErrorText show={error}>{error}</ErrorText>,
        ]}
      </Label>
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
