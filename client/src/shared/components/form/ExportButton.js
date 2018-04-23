/*
 * Labelled Input component
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CSVLink } from 'react-csv';
import { rgba } from 'polished';
import { colors, fonts } from '../../style_guide';

const Button = styled(CSVLink)`
  background-color: ${colors.highlight_primary}; /* Fallback */
  background: linear-gradient(
    0,
    ${rgba(colors.highlight_primary, 0.75)} 0%,
    ${colors.highlight_primary} 100%
  );
  &:hover {
    background: linear-gradient(
      0,
      ${rgba(colors.hover_primary, 0.75)} 0%,
      ${colors.hover_primary} 100%
    );
  }
  border: none;
  border-radius: 0.15em;
  outline: none;
  box-shadow: none;
  font: ${fonts.base};
  font-size: 0.9em;
  color: ${colors.dark};
  height: 2em;
  font-weight: ${fonts.weight.heavy};
  text-decoration: none;
  text-align: center;
  line-height: 4em;
  flex: ${props => props.flex || '1'};
  padding: 0.2em;
  padding-left: 1em;
  padding-right 1em;
`;

const ExportButton = (props) => {
  const { csvHeaders, visitsData, filenameSuffixes } = props;

  const csvVisitsFilename = `VisitsData${
    filenameSuffixes.activityFilter ? `-${filenameSuffixes.activityFilter}` : ''
  }${filenameSuffixes.genderFilter ? `-${filenameSuffixes.genderFilter}` : ''}${
    filenameSuffixes.ageFilter ? `-${filenameSuffixes.ageFilter}` : ''
  }.csv`;

  const csvUsersFilename = `VisitorData${
    filenameSuffixes.ageFilter ? `-${filenameSuffixes.ageFilter}` : ''
  }${filenameSuffixes.genderFilter ? `-${filenameSuffixes.genderFilter}` : ''}${
    filenameSuffixes.sort ? `-SortBy:${filenameSuffixes.sort}` : ''
  }.csv`;

  const csvFilename = filenameSuffixes.sort ? csvUsersFilename : csvVisitsFilename;

  return (
    <Button headers={csvHeaders} data={visitsData} download={csvFilename}>
      EXPORT AS CSV
    </Button>
  );
};

ExportButton.propTypes = {
  csvHeaders: PropTypes.arrayOf(PropTypes.object).isRequired,
  visitsData: PropTypes.arrayOf(PropTypes.object).isRequired,
  filenameSuffixes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default styled(ExportButton)``;
