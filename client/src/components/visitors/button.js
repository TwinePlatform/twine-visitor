import React from 'react';
import PropTypes from 'prop-types';
import { PrimaryButtonNoFill } from '../../shared/components/form/base';

const button = props => <PrimaryButtonNoFill type="submit">{props.label}</PrimaryButtonNoFill>;

button.propTypes = {
  label: PropTypes.string,
};

button.defaultProps = {
  label: 'Continue',
};

export default button;
