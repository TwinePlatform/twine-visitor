import React from 'react';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import { Link } from 'react-router-dom';

export const UserRow = ({
  id,
  fullname,
  sex,
  yearofbirth,
  email,
  date,
  userDetails,
}) => (
  <TableRow onClick={userDetails(id)}>
    <TableRowColumn style={{ width: 10 }}>{id}</TableRowColumn>
    <TableRowColumn>{fullname}</TableRowColumn>
    <TableRowColumn style={{ textOverflow: 'none' }}>{sex}</TableRowColumn>
    <TableRowColumn style={{ width: 40 }}>{yearofbirth}</TableRowColumn>
    <TableRowColumn style={{ textOverflow: 'none' }}>{email}</TableRowColumn>
    <TableRowColumn>
      {date.slice(0, 10)} {date.slice(11, 16)}
    </TableRowColumn>
  </TableRow>
);
