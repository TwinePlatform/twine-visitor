import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { filter, project, contains } from 'ramda';
import { Bar, Pie } from 'react-chartjs-2';
import { CSVLink } from 'react-csv';
import LabelledSelect from '../../shared/components/form/LabelledSelect';
import { Form as F, FormSection as FS } from '../../shared/components/form/base';
import { FlexContainerCol, FlexContainerRow } from '../../shared/components/layout/base';
import { Heading, Paragraph, Link } from '../../shared/components/text/base';
import TranslucentTable from '../components/TranslucentTable';
import { Visitors } from '../../api';
import { colors } from '../../shared/style_guide';

const circShift = (xs, n) => xs.slice(-n).concat(xs.slice(0, -n));
const repeat = (xs, n) =>
  (xs.length >= n
    ? xs.slice(0, n)
    : repeat(xs.concat(xs), n));

const PieChart = styled(Pie)``;

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

const genderOptions = [
  { key: '0', value: '' },
  { key: '1', value: 'male' },
  { key: '2', value: 'female' },
  { key: '3', value: 'Prefer not to say' },
];

const ageOptions = [
  { key: '0', value: '' },
  { key: '1', value: '0-17' },
  { key: '2', value: '18-34' },
  { key: '3', value: '35-50' },
  { key: '4', value: '51-69' },
  { key: '5', value: '70-more' },
];

const keyMap = {
  visit_id: null,
  visitor_id: 'Visitor ID',
  gender: 'Gender',
  yob: 'Year of birth',
  activity: 'Activities',
  visit_date: 'Date of visit',
};

const csvHeaders = [
  { label: 'Activity', key: 'activity' },
  { label: 'Gender', key: 'gender' },
  { label: 'Visit Date', key: 'visit_date' },
  { label: 'Visit ID', key: 'visit_id' },
  { label: 'Visitor ID', key: 'visitor_id' },
  { label: 'Year of Birth', key: 'yob' },
];

const columns = Object.values(keyMap).filter(Boolean);

const range = (start, end) => Array(+end - +start + 1).fill().map((_, idx) => +start + idx); //eslint-disable-line

export default class VisitsDataPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visitsList: [],
      filteredVisitsList: [],
      activities: [],
      filters: {},
      orderBy: '',
      genderNumbers: { datasets: [], labels: [] },
      visits: { datasets: [], labels: [] },
      visitNumbers: { datasets: [], labels: [] },
      ageGroups: { datasets: [], labels: [] },
      activitiesGroups: { datasets: [], labels: [] },
      errors: {},
    };
  }

  componentDidMount() {
    const pVisitors = Visitors.get(this.props.auth, { withVisits: true });
    const pStats = Visitors.getStatistics(this.props.auth);

    Promise.all([pVisitors, pStats])
      .then(([resVisitors, resStats]) => {
        this.props.updateAdminToken(resVisitors.headers.authorization);

        const visits = resVisitors.data.result;
        const [visitsNumbers, genderNumbers, activitiesNumbers, ageGroups, activities] = resStats.data.result; //eslint-disable-line

        this.setState({
          visits: visitsNumbers,
          visitNumbers: this.getVisitsWeek(visitsNumbers),
          genderNumbers: this.getGendersForChart(genderNumbers),
          activitiesGroups: this.getActivitiesForChart(activitiesNumbers),
          ageGroups: this.getAgeGroupsForChart(ageGroups),
          activities: activities.map(activity => activity.name),
          visitsList: visits,
          filteredVisitsList: visits,
        });
      })
      .catch(() => this.setState({ errors: { general: 'Unknown error' } }));
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value }, this.update)

  getActivitiesForChart = (activities) => {
    const activitiesData = {
      labels: activities.map(el => el.name),
      datasets: [
        {
          data: activities.map(el => el.count),
          backgroundColor: repeat([
            colors.highlight_primary,
            colors.highlight_secondary,
            colors.light,
          ], activities.length),
        },
      ],
    };
    return activitiesData;
  };

  getGendersForChart = (genders) => {
    const genderData = {
      labels: genders.map(el => el.sex),
      datasets: [
        {
          data: genders.map(el => el.count),
          backgroundColor: [
            colors.highlight_primary,
            colors.highlight_secondary,
            colors.light,
          ],
        },
      ],
    };
    return genderData;
  };

  getVisitsWeek = (visits) => {
    const now = moment();
    const today = now.format('dddd');
    const lastWeek = now.subtract(7, 'days');

    const dN = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayName = circShift(dN, -dN.indexOf(today));

    const initObj = dayName.reduce((acc, d) => { acc[d] = 0; return acc; }, {});
    const visitCount = visits
      .map(v => v.date)
      .slice().sort()
      .map(d => moment(d))
      .filter(m => m.isAfter(lastWeek))
      .reduce((acc, m) => {
        const day = m.format('dddd');
        acc[day]++; //eslint-disable-line
        return acc;
      }, initObj);


    return {
      labels: dayName,
      datasets: [
        {
          label: 'Visits over the last week',
          data: dayName.map(n => visitCount[n]),
          backgroundColor: [
            colors.highlight_primary,
            colors.highlight_secondary,
            colors.highlight_primary,
            colors.highlight_secondary,
            colors.highlight_primary,
            colors.highlight_secondary,
            colors.highlight_primary,
          ],
        },
      ],
    };
  };

  getAgeGroupsForChart = (ageGroups) => {
    const ageData = {
      labels: ageGroups.map(el => el.agegroups),
      datasets: [
        {
          data: ageGroups.map(el => el.agecount),
          backgroundColor: repeat([
            colors.highlight_primary,
            colors.highlight_secondary,
            colors.light,
          ], ageGroups.length),
        },
      ],
    };
    return ageData;
  };

  update = () => {

    const { ageFilter, activityFilter, genderFilter, visitsList } = this.state;
    let yearRange = [];

    if (ageFilter) {
      const year = moment().year();
      const ages = ageFilter.split('-').map(el => (el === 'more' ? 113 : el));
      const ageRange = range(ages[0], ages[1]);
      yearRange = ageRange.map(el => year - el);
    }
    const newFilteredVisitsList = visitsList
      .filter(el => (genderFilter ? el.gender === genderFilter.toLowerCase() : el))
      .filter(el => (activityFilter ? el.activity === activityFilter : el))
      .filter(el => (ageFilter ? contains(el.yob, yearRange) : el));

    this.setState({ filteredVisitsList: newFilteredVisitsList });

    Visitors.getStatistics(this.props.auth, {
      filter: [
        this.state.genderFilter && `gender@${this.state.genderFilter.toLowerCase()}`,
        this.state.ageFilter && `age@${this.state.ageFilter}`,
        this.state.activityFilter && `activity@${this.state.activityFilter}`,
      ].filter(Boolean),
      sort: { [this.state.orderBy]: 'asc' },
    })
      .then((res) => {
        this.props.updateAdminToken(res.headers.authorization);
        return res.data.result;
      })
      .then((res) => {
        this.setState(
          {
            users: res[0],
            ageGroups: this.getAgeGroupsForChart(res[1]),
            activitiesGroups: this.getActivitiesForChart(res[2]),
            genderNumbers: this.getGendersForChart(res[3]),
          },
        );
      })
      .catch(() => {
        this.setState({ errors: { general: 'Unknown error' } });
      });
  }

  render() {
    const { errors, filteredVisitsList } = this.state;
    const activityOptions = [''].concat(this.state.activities).map((a, i) => ({ key: `${i}`, value: a }));
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
                options={genderOptions}
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
            <Paragraph>Visitor numbers</Paragraph>
            <BarChart
              data={this.state.visitNumbers}
              options={{ responsive: true, maintainAspectRatio: false, legend: { display: false } }}
            />
          </FlexItem>
          <FlexItem>
            <Paragraph>Visitors by gender</Paragraph>
            <PieChart
              data={this.state.genderNumbers}
            />
          </FlexItem>
          <FlexItem>
            <Paragraph>Visitors by age</Paragraph>
            <PieChart
              data={this.state.ageGroups}
            />
          </FlexItem>
          <FlexItem>
            <Paragraph>Reason for visiting</Paragraph>
            <PieChart
              data={this.state.activitiesGroups}
            />
          </FlexItem>
        </Row>
        <Row>
          <TranslucentTable
            headAlign="left"
            columns={columns}
            rows={
              filteredVisitsList
                .map(visit => ({
                  ...visit,
                  visit_date: moment(visit.visit_date).format('DD-MM-YY HH:mm'),
                }))
                .map(visit => ({
                  key: visit.visit_id,
                  data: Object.values(project(Object.keys(filter(Boolean, keyMap)), [visit])[0]),
                }))
            }
          />
        </Row>
        <CSVLink headers={csvHeaders} data={this.state.visitsList}> Download Me</CSVLink>
      </FlexContainerCol>
    );
  }
}


VisitsDataPage.propTypes = {
  auth: PropTypes.string.isRequired,
  updateAdminToken: PropTypes.func.isRequired,
};
