import React from 'react';
import { List, ListItem } from 'material-ui/List';

export const IntroText = ({ text }) => (
  <List>
    <ListItem disabled style={{ color: 'rgba(0, 0, 0, 0.54)' }}>
      {text}
    </ListItem>
  </List>
);
