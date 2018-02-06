import React from 'react';
import { List, ListItem } from 'material-ui/List';

export const EmptyUsersTable = () => (
  <List>
    <ListItem disabled style={{ color: 'rgba(0, 0, 0, 0.54)' }}>
      There are no users on record for your business
    </ListItem>
  </List>
);
