import React from 'react';
import PropTypes from 'prop-types';

const button = props => (
  <button className="Button" type="submit">
    {props.label}
  </button>
);

button.propTypes = {
  label: PropTypes.string,
};

button.defaultProps = {
  label: 'Continue',
};

export default button;
