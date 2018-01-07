import React from 'react';

export const ActivityForm = props => (
  <form onSubmit={props.handleSubmit}>
    <input
      className="Form__Input"
      type="text"
      onChange={props.handleInputChange}
      value={props.currentActivity}
    />
  </form>
);
