import React from 'react';
import { List } from 'material-ui/List';
import { ActivityItem } from './ActivityItem';

export const ActivityList = ({
  activities,
  openDeleteModal,
  deleteModal,
  toggleDay,
  handleRemove,
}) => (
  <List>
    {activities.map(activity => (
      <ActivityItem
        openDeleteModal={openDeleteModal}
        deleteModal={deleteModal}
        toggleDay={toggleDay}
        key={activity.id}
        {...activity}
        handleRemove={handleRemove}
      />
    ))}
  </List>
);
