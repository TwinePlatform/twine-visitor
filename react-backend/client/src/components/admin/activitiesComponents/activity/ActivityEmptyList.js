import React from 'react';
import { List, ListItem } from 'material-ui/List';

export const ActivityEmptyList = () => (
  <List>
    <ListItem disabled style={{ color: 'rgba(0, 0, 0, 0.54)' }}>
      Add an activity to get started
    </ListItem>
  </List>
);
