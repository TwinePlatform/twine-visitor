import React from 'react';
import PropTypes from 'prop-types';

const ActivityForm = props => (
  <form onSubmit={props.handleSubmit}>
    <label className="Form__Label" htmlFor="activity-form-input">
      Add a new activity
      <br />
      <input
        id="activity-form-input"
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

export default ActivityForm;
