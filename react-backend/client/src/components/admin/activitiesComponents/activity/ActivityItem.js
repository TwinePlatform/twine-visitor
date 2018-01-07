import React from 'react';
import { partial } from '../../activitiesLib/utils';

export const ActivityItem = (props) => {
  const handleRemove = partial(props.handleRemove, props.id);
  return (
    <li>
      <span className="delete-item">
        <button onClick={handleRemove}> X </button>
      </span>
      {props.name}
    </li>
  );
};
