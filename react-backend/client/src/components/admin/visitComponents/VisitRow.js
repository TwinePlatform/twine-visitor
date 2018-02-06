import React from 'react';
import { TableRow, TableRowColumn } from 'material-ui/Table';

export const VisitRow = ({ id, sex, yearofbirth, name, date }) => (
  <TableRow>
    <TableRowColumn style={{ width: 10 }}>{id}</TableRowColumn>
    <TableRowColumn style={{ textOverflow: 'none' }}>{sex}</TableRowColumn>
    <TableRowColumn>{yearofbirth}</TableRowColumn>
    <TableRowColumn>{name}</TableRowColumn>
    <TableRowColumn>
      {date.slice(0, 10)} {date.slice(11, 16)}
    </TableRowColumn>
  </TableRow>
);
