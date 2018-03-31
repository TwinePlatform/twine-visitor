import React from 'react';
import PropTypes from 'prop-types';
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


const DetailsTable = ({ caption, rows }) => (
  <Table>
    {
      caption && <TableCaption>{caption}</TableCaption>
    }
    <TableBody>
      {
        rows.map(({ name, value }) => (
          <TableRow key={name}>
            <TableCell>{name}</TableCell>
            <TableCell>{value}</TableCell>
          </TableRow>
        ))
      }
    </TableBody>
  </Table>
);

DetailsTable.propTypes = {
  caption: PropTypes.string,
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ),
};

DetailsTable.defaultProps = {
  caption: null,
  rows: [],
};

export default DetailsTable;
