import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { filter, project, pick, evolve, assoc, pipe, prepend } from 'ramda';
import { Bar, Pie } from 'react-chartjs-2';
import csv from 'fast-csv';
import { saveAs } from 'file-saver';
import LabelledSelect from '../../shared/components/form/LabelledSelect';
import { Form as F, FormSection as FS, PrimaryButton } from '../../shared/components/form/base';
// import ExportButton from '../../shared/components/form/ExportButton';
import { FlexContainerCol, FlexContainerRow } from '../../shared/components/layout/base';
import { colors, fonts } from '../../shared/style_guide';
import { Heading, Paragraph, Link } from '../../shared/components/text/base';
import TranslucentTable from '../components/TranslucentTable';
import { Visitors, ErrorUtils } from '../../api';

const circShift = (xs, n) => xs.slice(-n).concat(xs.slice(0, -n));
const repeat = (xs, n) => (xs.length >= n ? xs.slice(0, n) : repeat(xs.concat(xs), n));

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

const genderOptions = [
  { key: '0', value: '' },
  { key: '1', value: 'male' },
  { key: '2', value: 'female' },
  { key: '3', value: 'prefer not to say' },
];

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
  visitor_id: 'Visitor ID',
  gender: 'Gender',
  yob: 'Year of birth',
  activity: 'Activities',
  visit_date: 'Date of visit',
};

const columns = Object.values(keyMap).filter(Boolean);

export default class VisitsDataPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
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
    };
  }

  componentDidMount() {
    const pVisitors = Visitors.get(this.props.auth, { withVisits: true, pagination: true });
    const pStats = Visitors.getStatistics(this.props.auth);

    Promise.all([pVisitors, pStats])
      .then(([resVisitors, resStats]) => {
        this.props.updateAdminToken(resVisitors.headers.authorization);

        const visits = resVisitors.data.result;

        const [
          visitsNumbers,
          genderNumbers,
          activitiesNumbers,
          ageGroups,
          activities,
        ] = resStats.data.result;

        this.setState({
          visitNumbers: this.getVisitsWeek(visitsNumbers),
          genderNumbers: this.getGendersForChart(genderNumbers),
          activitiesGroups: this.getActivitiesForChart(activitiesNumbers),
          ageGroups: this.getAgeGroupsForChart(ageGroups),
          activities: activities.map(activity => activity.name),
          visitsList: visits,
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
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value }, this.update);

  getActivitiesForChart = (activities) => {
    const activitiesData = {
      labels: activities.map(el => el.name),
      datasets: [
        {
          data: activities.map(el => el.count),
          backgroundColor: repeat(
            [colors.highlight_primary, colors.highlight_secondary, colors.light],
            activities.length,
          ),
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
          backgroundColor: [colors.highlight_primary, colors.highlight_secondary, colors.light],
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

    const initObj = dayName.reduce((acc, d) => {
      acc[d] = 0;
      return acc;
    }, {});
    const visitCount = visits
      .map(v => v.date)
      .slice()
      .sort()
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
          backgroundColor: repeat(
            [colors.highlight_primary, colors.highlight_secondary, colors.light],
            ageGroups.length,
          ),
        },
      ],
    };
    return ageData;
  };

  getDataForCsv = () => {
    Visitors.get(this.props.auth, { withVisits: true })
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
            activity: 'Activity',
            visit_date: 'Visit Date',
            visit_time: 'Visit Time',
          },
          csvData,
        );

        csv.writeToString(withHeaders, (err, data) => {
          if (err) throw new Error(err);
          const csvFile = new File([data], 'visits_data.csv', { type: 'text/plain;charset=utf-8' });
          saveAs(csvFile);
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

  update = () => {
    const { genderFilter, ageFilter, activityFilter, page, limit = 10 } = this.state;
    const offset = page * limit - limit; // eslint-disable-line
    const pVisitors = Visitors.get(this.props.auth, {
      withVisits: true,
      pagination: true,
      offset,
      genderFilter,
      ageFilter,
      activityFilter,
    });
    const pStats = Visitors.getStatistics(this.props.auth, {
      filter: [
        this.state.genderFilter && `gender@${this.state.genderFilter.toLowerCase()}`,
        this.state.ageFilter && `age@${this.state.ageFilter}`,
        this.state.activityFilter && `activity@${this.state.activityFilter}`,
      ].filter(Boolean),
      sort: { [this.state.orderBy]: 'asc' },
    });

    Promise.all([pVisitors, pStats])
      .then(([resVisitors, resStats]) => {
        this.props.updateAdminToken(resVisitors.headers.authorization);

        const visits = resVisitors.data.result;
        const stats = resStats.data.result; // res[0] no longer used

        this.setState({
          ageGroups: this.getAgeGroupsForChart(stats[1]),
          activitiesGroups: this.getActivitiesForChart(stats[2]),
          genderNumbers: this.getGendersForChart(stats[3]),
          visitsList: visits,
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
            <PieChart data={this.state.genderNumbers} />
          </FlexItem>
          <FlexItem>
            <Paragraph>Visitors by age</Paragraph>
            <PieChart data={this.state.ageGroups} />
          </FlexItem>
          <FlexItem>
            <Paragraph>Reason for visiting</Paragraph>
            <PieChart data={this.state.activitiesGroups} />
          </FlexItem>
        </Row>
        <Row>
          <TranslucentTable
            exportComponent={
              <ExportButton onClick={this.getDataForCsv}>EXPORT AS CSV</ExportButton>
            }
            headAlign="left"
            columns={columns}
            rows={visitsList
              .map(visit => ({
                ...visit,
                visit_date: moment(visit.visit_date).format('DD-MM-YY HH:mm'),
              }))
              .map(visit => ({
                key: visit.visit_id,
                data: Object.values(project(Object.keys(filter(Boolean, keyMap)), [visit])[0]),
              }))}
          />
        </Row>
      </FlexContainerCol>
    );
  }
}

VisitsDataPage.propTypes = {
  auth: PropTypes.string.isRequired,
  updateAdminToken: PropTypes.func.isRequired,
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
