import React from 'react';
import { ActivityItem } from './ActivityItem';

export const ActivityList = props => (
  <div className="Activity-List">
    <ul>
      {props.activities.map(activity => (
        <ActivityItem
          toggleDay={props.toggleDay}
          key={activity.id}
          {...activity}
          handleRemove={props.handleRemove}
        />
      ))}
    </ul>
  </div>
);
