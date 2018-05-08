import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { rgba } from 'polished';
import { colors } from '../../shared/style_guide';


const TableContainer = styled.div`
  border: 0.1em solid ${rgba(colors.highlight_primary, 0.12)};
  background-color: ${rgba(colors.highlight_primary, 0.06)};
  color: ${colors.dark};
  width: 100%;
  padding: 2em;
`;

const Table = styled.table`
  border-collapse: collapse;
  background: transparent;
  width: 100%;
`;
const TableCaption = styled.caption`
  display: none;
`;
const TableBody = styled.tbody``;
const TableRow = styled.tr`
  height: 3em;
  ${
  props =>
    (props.border
      ? css`
          border-top: 0.1em solid ${colors.light};
          border-bottom: 0.1em solid ${colors.light};
        `
      : '')
}
`;
const TableCell = styled.td`
  vertical-align: center;
`;
const TableHead = styled.thead``;
const TableColHeading = styled.th`
  text-align: ${props => props.align || 'center'};
`;


const TranslucentTable = ({ caption, columns, rows, headAlign, exportComponent }) => (
  <TableContainer>
    <Table>
      {
        caption && <TableCaption>{caption}</TableCaption>
      }
      {
        columns &&
          <TableHead>
            <TableRow>
              {
                columns.map(col =>
                  <TableColHeading align={headAlign} key={col}>{col}</TableColHeading>)
              }
            </TableRow>
          </TableHead>
      }
      <TableBody>
        {
          rows.map(({ key, data, onClick }) => (
            <TableRow border key={key} onClick={onClick}>
              {
                data.map((cell, i) => <TableCell key={i}>{`${cell}`}</TableCell>) // eslint-disable-line
              }
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
    {exportComponent}
  </TableContainer>
);


TranslucentTable.propTypes = {
  exportComponent: PropTypes.element,
  caption: PropTypes.node,
  columns: PropTypes.arrayOf(PropTypes.string),
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      data: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    })),
  headAlign: PropTypes.oneOf(['left', 'center', 'right']),
};

TranslucentTable.defaultProps = {
  exportComponent: null,
  caption: null,
  columns: [],
  rows: [],
  headAlign: 'left',
};

export default TranslucentTable;
