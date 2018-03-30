import React from 'react';
import styled from 'styled-components';
import { rgba } from 'polished';
import { colors } from '../../shared/style_guide';


const Table = styled.table`
  background-color: ${colors.highlight_secondary}; /* Fallback */
  background: linear-gradient(0, ${rgba(colors.highlight_secondary, 0.75)} 0%, ${colors.highlight_secondary} 100%);
  color: ${colors.white};
  width: 90%;
  height: 6em;
  padding: 2em;
`;
const TableCaption = styled.caption`
  display: none;
`;
const TableBody = styled.tbody``;
const TableRow = styled.tr``;
const TableCell = styled.td``;


const rows = [
  { name: 'Business ID', key: 'id' },
  { name: 'Type of business', key: 'sector' },
  { name: 'Email', key: 'email' },
  { name: 'Region', key: 'region' },
  { name: 'Registration date', key: 'registeredAt' },
];


export default props => (
  <Table>
    <TableCaption>Business details</TableCaption>
    <TableBody>
      {
        rows.map(({ name, key }) => (
          <TableRow key={key}>
            <TableCell>{name}</TableCell>
            <TableCell>{props[key]}</TableCell>
          </TableRow>
        ))
      }
    </TableBody>
  </Table>
);
