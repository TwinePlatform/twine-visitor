import React from 'react';

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
