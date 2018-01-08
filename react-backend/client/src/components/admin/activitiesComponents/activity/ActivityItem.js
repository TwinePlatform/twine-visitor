import React from 'react';
import { partial } from '../../activitiesLib/utils';

export const ActivityItem = (props) => {
  const handleRemove = partial(props.handleRemove, props.id);
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  return (
    <li>
      <span className="delete-item">
        <button onClick={handleRemove}> X </button>
      </span>
      {props.name}
      {days.map(day => (
        <input
          key={day}
          type="checkbox"
          onChange={() => props.toggleDay(day, props.id)}
          //! ! means it's a boolean for sure
          checked={!!props[day]}
        />
      ))}
    </li>
  );
};
