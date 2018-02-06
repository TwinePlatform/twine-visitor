import React from 'react';
import { List, ListItem } from 'material-ui/List';

export const EmptyVisitsTable = () => (
  <List>
    <ListItem disabled style={{ color: 'rgba(0, 0, 0, 0.54)' }}>
      There are no visits on record for your business
    </ListItem>
  </List>
);
