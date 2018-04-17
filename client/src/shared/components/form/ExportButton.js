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
  line-height: 2em;
  flex: ${props => props.flex || '1'};
`;


const ExportButton = (props) => {
  const { csvHeaders, visitsData, visits, state } = props;

  const csvVisitsFilename = `VisitsData${
    state.activityFilter ? `-${state.activityFilter}` : ''
  }${state.genderFilter ? `-${state.genderFilter}` : ''}${
    state.ageFilter ? `-${state.ageFilter}` : ''
  }.csv`;

  const csvUsersFilename = `VisitorData${state.ageFilter ? `-${state.ageFilter}` : ''}${
    state.genderFilter ? `-${state.genderFilter}` : ''
  }${state.sort ? `-SortBy:${state.sort}` : ''}.csv`;

  const csvFilename = visits ? csvVisitsFilename : csvUsersFilename;

  return (
    <div>
      <Button
        headers={csvHeaders}
        data={visitsData}
        download={csvFilename}
      >
            EXPORT AS CSV
      </Button>
    </div>
  );
};


ExportButton.propTypes = {
  csvHeaders: PropTypes.arrayOf(PropTypes.object).isRequired,
  visitsData: PropTypes.arrayOf(PropTypes.object).isRequired,
  visits: PropTypes.bool.isRequired,
  state: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default styled(ExportButton)`
  margin-bottom: 1em;
`;
