import React from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from 'material-ui/Table';

import { VisitRow } from './VisitRow';

export const VisitsTable = ({ visits }) => (
  <Table
    selectable={false}
    style={{ width: 700, paddingLeft: 0, paddingRight: 0 }}
    bodyStyle={{ overflow: null }}
  >
    <TableHeader
      displaySelectAll={false}
      enableSelectAll={false}
      adjustForCheckbox={false}
    >
      <TableRow>
        <TableHeaderColumn style={{ width: 10 }}>ID</TableHeaderColumn>
        <TableHeaderColumn>Gender</TableHeaderColumn>
        <TableHeaderColumn>Year of Birth</TableHeaderColumn>
        <TableHeaderColumn>Activity</TableHeaderColumn>
        <TableHeaderColumn>Date of Visits</TableHeaderColumn>
      </TableRow>
    </TableHeader>
    <TableBody displayRowCheckbox={false}>
      {visits.map(visit => <VisitRow key={visit.date} {...visit} />)}
    </TableBody>
  </Table>
);
