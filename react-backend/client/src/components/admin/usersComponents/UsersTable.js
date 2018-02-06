import React from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from 'material-ui/Table';

import { UserRow } from './UserRow';

export const UsersTable = ({ users, userDetails }) => (
  <Table
    style={{ minWidth: '100%', width: 850, paddingLeft: 0, paddingRight: 0 }}
    bodyStyle={{ overflow: null }}
  >
    <TableHeader
      displaySelectAll={false}
      enableSelectAll={false}
      adjustForCheckbox={false}
    >
      <TableRow>
        <TableHeaderColumn style={{ width: 10 }}>User ID</TableHeaderColumn>
        <TableHeaderColumn>Name</TableHeaderColumn>
        <TableHeaderColumn>Gender</TableHeaderColumn>
        <TableHeaderColumn style={{ width: 40 }}>
          Year of Birth
        </TableHeaderColumn>
        <TableHeaderColumn>Email</TableHeaderColumn>
        <TableHeaderColumn>Date of Signup</TableHeaderColumn>
      </TableRow>
    </TableHeader>

    <TableBody displayRowCheckbox={false} showRowHover>
      {users.map(user => (
        <UserRow key={user.id} {...user} userDetails={userDetails} />
      ))}
    </TableBody>
  </Table>
);
