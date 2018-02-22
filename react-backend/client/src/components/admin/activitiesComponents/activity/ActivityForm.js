import React from 'react';
import PropTypes from 'prop-types';

export const ActivityForm = props => (
  <form onSubmit={props.handleSubmit}>
    <label className="Form__Label">
      Add a new activity
      <br />
      <input
        className="Form__Input"
        type="text"
        onChange={props.handleInputChange}
        value={props.currentActivity}
      />
    </label>
  </form>
);

ActivityForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  currentActivity: PropTypes.string,
};

ActivityForm.defaultProps = {
  currentActivity: '',
};
