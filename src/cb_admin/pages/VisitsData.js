import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { filter, project, pick, evolve, assoc, pipe, prepend, identity, toPairs, head, last, map } from 'ramda';
import { Bar, Pie } from 'react-chartjs-2';
import csv from 'fast-csv';
import { saveAs } from 'file-saver';
import LabelledSelect from '../../shared/components/form/LabelledSelect';
import { Form as F, FormSection as FS, PrimaryButton } from '../../shared/components/form/base';
import { FlexContainerCol, FlexContainerRow } from '../../shared/components/layout/base';
import { colors, fonts } from '../../shared/style_guide';
import { Heading, Paragraph, Link } from '../../shared/components/text/base';
import TranslucentTable from '../components/TranslucentTable';
import PaginatedTableWrapper from '../components/PaginatedTableWrapper';
import { ErrorUtils, CommunityBusiness, Visitors } from '../../api';
import { renameKeys } from '../../util';

const repeat = (xs, n) => (xs.length >= n ? xs.slice(0, n) : repeat(xs.concat(xs), n));

const BarChart = styled(Bar)``;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
`;

const Form = F.extend`
  width: 100%;
`;

const FormSection = FS.extend`
  width: 33%;
`;

const Row = FlexContainerRow.extend`
  align-content: center;
  align-items: flex-start;
  margin-bottom: 2em;
`;

const FlexItem = styled.div`
  flex: ${props => props.flex || '1'};
  height: 100%;
`;

const HyperLink = Link.extend`
  flex: ${props => props.flex || '1'};
`;

const ExportButton = PrimaryButton.extend`
  color: ${colors.dark};
  font-size: 0.9em;
  font-weight: ${fonts.weight.heavy};
  text-align: center;
  letter-spacing: 0;
  flex: ${props => props.flex || '1'};
  margin-top: 1rem;
  padding: 0.3rem 1rem;
`;

const ageOptions = [
  { key: '0', value: '' },
  { key: '1', value: '0-17' },
  { key: '2', value: '18-34' },
  { key: '3', value: '35-50' },
  { key: '4', value: '51-69' },
  { key: '5', value: '70+' },
];

const keyMap = {
  visit_id: null,
  userId: 'Visitor ID',
  gender: 'Gender',
  birthYear: 'Year of birth',
  visitActivity: 'Activities',
  createdAt: 'Date of visit',
};

const columns = Object.values(keyMap).filter(Boolean);

export default class VisitsDataPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fullCount: 0,
      visitsList: [],
      activities: [],
      genderFilter: '',
      ageFilter: '',
      activityFilter: '',
      orderBy: '',
      genderNumbers: { datasets: [], labels: [] },
      visitNumbers: { datasets: [], labels: [] },
      ageGroups: { datasets: [], labels: [] },
      activitiesGroups: { datasets: [], labels: [] },
      errors: {},
      genderList: [],
    };
  }

  componentDidMount() {
    /*
     * this.getData should be split into getTableData & getGraphData to avoid
     * graph data being requested due to pagination
     * this.getData currently called by PaginatedTableWrapper
     *
     * see https://github.com/TwinePlatform/twine-visitor/issues/499
     */

    Visitors.genders().then(res => this.setState({
      genderList: [{ key: 0, value: '' }].concat(res.data.result.map(renameKeys({ id: 'key', name: 'value' }))),
    }));
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value }, this.getData);

  getActivitiesForChart = (activityData) => {
    const pairedActivityData = toPairs(activityData);
    const activitiesData = {
      labels: map(head, pairedActivityData),
      datasets: [
        {
          data: map(last, pairedActivityData),
          backgroundColor: repeat(
            [colors.highlight_primary, colors.highlight_secondary, colors.light],
            pairedActivityData.length,
          ),
        },
      ],
    };
    return activitiesData;
  };

  getGendersForChart = (genderData) => {
    const pairedGenderData = toPairs(genderData);
    return {
      labels: map(head, pairedGenderData),
      datasets: [
        {
          data: map(last, pairedGenderData),
          backgroundColor: [colors.highlight_primary, colors.highlight_secondary, colors.light],
        },
      ],
    };
  };

  getVisitsWeek = (visits) => {
    const pairedVisits = toPairs(visits);
    return {
      labels: map(head, pairedVisits),
      datasets: [
        {
          label: 'Visits over the last week',
          data: map(last, pairedVisits),
          backgroundColor: repeat([
            colors.highlight_primary,
            colors.highlight_secondary,
          ], 7),
        },
      ],
    };
  };

  getAgeGroupsForChart = (ageData) => {
    const pairedAgeData = toPairs(ageData);
    return {
      labels: map(head, pairedAgeData),
      datasets: [
        {
          data: map(last, pairedAgeData),
          backgroundColor: repeat(
            [colors.highlight_primary, colors.highlight_secondary, colors.light],
            pairedAgeData.length,
          ),
        },
      ],
    };
  };

  getDataForCsv = () => {
    const { genderFilter, ageFilter, activityFilter } = this.state;

    Visitors.get({
      withVisits: true,
      genderFilter,
      ageFilter,
      activityFilter,
    })
      .then((res) => {
        const csvData = res.data.result.map(x =>
          pipe(
            pick(['visit_id', 'visitor_name', 'gender', 'yob', 'activity', 'visit_date']),
            assoc('visit_time', moment(x.visit_date).format('HH:MM')),
            evolve({ visit_date: y => moment(y).format('DD-MM-YYYY') }),
          )(x),
        );
        const withHeaders = prepend(
          {
            visit_id: 'Visit ID',
            visitor_name: 'Full Name',
            gender: 'Gender',
            yob: 'Year of Birth',
            visitActivity: 'Activity',
            visit_date: 'Visit Date',
            visit_time: 'Visit Time',
          },
          csvData,
        );

        const filterOptions = [genderFilter, ageFilter, activityFilter].filter(Boolean).join('-');
        const fileNameFilters = filterOptions ? `-${filterOptions}` : '';

        csv.writeToString(withHeaders, (err, data) => {
          if (err) {
            this.setState({ errors: { general: 'Could not create CSV' } });
          } else {
            const csvFile = new File([data], `user_data${fileNameFilters}.csv`, {
              type: 'text/plain;charset=utf-8',
            });
            saveAs(csvFile);
          }
        });
      })
      .catch((error) => {
        if (ErrorUtils.errorStatusEquals(error, 401)) {
          this.props.history.push('/admin/login');
        } else if (ErrorUtils.errorStatusEquals(error, 500)) {
          this.props.history.push('/error/500');
        } else {
          this.setState({ errors: { general: 'Could not create CSV' } });
        }
      });
  };

  getData = (offset = 0) => {
    const { genderFilter, ageFilter: _ageFilter, activityFilter } = this.state;
    const ageFilter = _ageFilter === '70+' //eslint-disable-line
      ? [70, 112]
      : _ageFilter
        ? _ageFilter.split(/[-+]/)
        : '';

    const queryFilter = {
      gender: genderFilter,
      age: ageFilter,
      visitActivity: activityFilter,
    };

    const getVisits = CommunityBusiness.getVisits(
      { limit: 10,
        offset,
        filter: filter(identity, queryFilter),
      });
    const getAggregates = CommunityBusiness.getVisitAggregates(
      { fields: ['gender', 'age', 'visitActivity', 'lastWeek'],
        filter: filter(identity, queryFilter),
      });


    Promise.all([getVisits, getAggregates])
      .then(([resVisits, resAggs]) => {

        const { meta: { total: fullCount }, result: visitsList } = resVisits.data;
        const { result: { visitActivity, age, gender, lastWeek } } = resAggs.data;

        this.setState({
          visitNumbers: this.getVisitsWeek(lastWeek),
          genderNumbers: this.getGendersForChart(gender),
          activitiesGroups: this.getActivitiesForChart(visitActivity),
          ageGroups: this.getAgeGroupsForChart(age),
          activities: Object.keys(visitActivity),
          visitsList,
          fullCount,
        });
      })
      .catch((error) => {
        if (ErrorUtils.errorStatusEquals(error, 401)) {
          this.props.history.push('/admin/login');
        } else if (ErrorUtils.errorStatusEquals(error, 500)) {
          this.props.history.push('/error/500');
        } else {
          this.setState({ errors: { general: 'Could not fetch visits data' } });
        }
      });
  };

  render() {
    const { errors, visitsList } = this.state;
    const activityOptions = ['']
      .concat(this.state.activities)
      .map((a, i) => ({ key: `${i}`, value: a }));
    return (
      <FlexContainerCol expand>
        <Nav>
          <HyperLink to="/admin"> Back to dashboard </HyperLink>
          <Heading flex={2}>Visits data</Heading>
          <FlexItem />
        </Nav>
        <Row flex={2}>
          <Form onChange={this.onChange}>
            <FormSection>
              <LabelledSelect
                id="visits-data-gender"
                name="genderFilter"
                label="Filter by gender"
                options={this.state.genderList}
                errors={errors.gender}
              />
            </FormSection>
            <FormSection>
              <LabelledSelect
                id="visits-data-age"
                name="ageFilter"
                label="Filter by age"
                options={ageOptions}
                errors={errors.age}
              />
            </FormSection>
            <FormSection>
              <LabelledSelect
                id="visits-data-activity"
                name="activityFilter"
                label="Filter by activity"
                options={activityOptions}
                errors={errors.activity}
              />
            </FormSection>
          </Form>
        </Row>
        <Row flex={3}>
          <FlexItem>
            <Paragraph>Visitor numbers in last week</Paragraph>
            <BarChart
              data={this.state.visitNumbers}
              options={{
                legend: { display: false },
                scales: {
                  yAxes: [{
                    ticks: {
                      beginAtZero: true,
                      stepSize: 1,
                      /*
                       * NB this may need to be dynamically set in
                       * future to accomodate large datasets
                       * see https://github.com/TwinePlatform/twine-visitor/issues/503
                       */
                    },
                  }],
                } }
              }
            />
          </FlexItem>
          <FlexItem>
            <Paragraph>Visitors by gender</Paragraph>
            <Pie data={this.state.genderNumbers} />
          </FlexItem>
          <FlexItem>
            <Paragraph>Visitors by age</Paragraph>
            <Pie data={this.state.ageGroups} />
          </FlexItem>
          <FlexItem>
            <Paragraph>Reason for visiting</Paragraph>
            <Pie data={this.state.activitiesGroups} />
          </FlexItem>
        </Row>
        <Row>
          <PaginatedTableWrapper
            rowCount={this.state.fullCount}
            loadRows={this.getData}
          >
            <TranslucentTable
              exportComponent={
                <ExportButton onClick={this.getDataForCsv}>EXPORT AS CSV</ExportButton>
              }
              headAlign="left"
              columns={columns}
              rows={visitsList
                .map(visit => ({
                  ...visit,
                  createdAt: moment(visit.createdAt).format('DD-MM-YY HH:mm'),
                }))
                .map(visit => ({
                  key: visit.id,
                  data: Object.values(project(Object.keys(filter(Boolean, keyMap)), [visit])[0]),
                }))}
            />
          </PaginatedTableWrapper>
        </Row>
      </FlexContainerCol>
    );
  }
}

VisitsDataPage.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};