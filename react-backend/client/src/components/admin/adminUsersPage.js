import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Pie, Bar } from 'react-chartjs-2';
import Logoutbutton from '../visitors/logoutbutton';
import { DropdownSelect, CheckboxGroup } from './filter_components/UserInputs';
import { Visitors } from '../../api';

export default class AdminUsersPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: 'PENDING',
      users: [],
      activities: [],
      filters: [],
      orderBy: '',
      genderNumbers: [],
      visits: [],
      visitNumbers: [],
      ageGroups: [],
      activitiesGroups: [],
    };
  }

  componentDidMount() {
    Visitors.getStatistics(this.props.auth)
      .then((res) => {
        this.props.updateAdminToken(res.headers.authorization);
        return res.data.numbers;
      })
      .then(([visitsNumbers, genderNumbers, activitiesNumbers, ageGroups, activities]) => {
        this.setState({
          visits: visitsNumbers,
          visitNumbers: this.getVisitsWeek(visitsNumbers),
          genderNumbers: this.getGendersForChart(genderNumbers),
          activitiesGroups: this.getActivitiesForChart(activitiesNumbers),
          ageGroups: this.getAgeGroupsForChart(ageGroups),
          activities: activities.map(activity => activity.name),
        });

        return Visitors.get(this.props.auth);
      })
      .then((res) => {
        this.props.updateAdminToken(res.headers.authorization);
        return res.data;
      })
      .then(({ users }) => this.setState({ auth: 'SUCCESS', users }))
      .catch(error => this.setErrorMessage(error, 'Error fetching gender numbers'));
  }

  setErrorMessage = (error, errorString) => {
    // console.log(error) // Uncomment to display full errors in the console.
    this.setState({ errorMessage: errorString });
  };

  getActivitiesForChart = (activities) => {
    if (!activities) return [];

    const activitiesColoursMain = [
      '#FFE7E7',
      '#800000',
      '#FF0000',
      '#FFA500',
      '#008080',
      '#800080',
      '#008000',
      '#808000',
      '#000000',
    ];
    const activitiesColoursHover = [
      '#DFC6C6',
      '#812B2B',
      '#FF5F5F',
      '#FFC251',
      '#4D8181',
      '#843C84',
      '#337F33',
      '#797937',
      '#262020',
    ];

    const activitiesData = {
      labels: activities.map(el => el.name),
      datasets: [
        {
          data: activities.map(el => el.count),
          backgroundColor: activitiesColoursMain,
          hoverBackgroundColor: activitiesColoursHover,
        },
      ],
    };
    return activitiesData;
  };

  getGendersForChart = (genders) => {
    if (!genders) return [];

    const genderColoursMain = ['#FC0303', '#3100FF', '#0FFF00'];
    const genderColoursHover = ['#FF4848', '#5C36FF', '#68FF5E'];

    const genderData = {
      labels: genders.map(el => el.sex),
      datasets: [
        {
          data: genders.map(el => el.count),
          backgroundColor: genderColoursMain,
          hoverBackgroundColor: genderColoursHover,
        },
      ],
    };
    return genderData;
  };

  getVisitsWeek = (visits) => {
    if (!visits) return [];
    const visitCount = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
    };

    Object.values(visits).forEach((key) => {
      if (key.date > Date.now() - 691200000) {
        const num = new Date(key.date);
        visitCount[num.getDay()]++; // eslint-disable-line no-plusplus
      }
    });

    const dayName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const buildDaysWithOffset = (num, array) =>
      Array.from({ length: 7 }, (_, index) => array[(index + num) % 7]);

    const dayWeek = new Date();
    return {
      labels: buildDaysWithOffset(dayWeek.getDay(), dayName),
      datasets: [
        {
          label: 'Visits over the last week',
          fillColor: '#F7464A',
          strokeColor: 'rgba(220,220,220,0.8)',
          highlightFill: '#FF5A5E',
          highlightStroke: 'rgba(220,220,220,1)',
          data: buildDaysWithOffset(dayWeek.getDay(), visitCount),
        },
      ],
    };
  };

  getAgeGroupsForChart = (ageGroups) => {
    if (!ageGroups) return [];

    const genderColoursMain = ['#00FFB0', '#FF00B5', '#FDB45C', '#949FB1', '#4D5360'];
    const genderColoursHover = ['#77FFD5', '#FF62D2', '#FFC870', '#A8B3C5', '#616774'];

    const ageData = {
      labels: ageGroups.map(el => el.agegroups),
      datasets: [
        {
          data: ageGroups.map(el => el.agecount),
          backgroundColor: genderColoursMain,
          hoverBackgroundColor: genderColoursHover,
        },
      ],
    };
    return ageData;
  };

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  updateResults = () =>
    Visitors.getStatistics(this.props.auth, {
      filter: this.state.filters,
      sort: { [this.state.orderBy]: 'asc' },
    })
      .then((res) => {
        this.props.updateAdminToken(res.headers.authorization);
        return res.data;
      })
      .then((res) => {
        this.setState(
          {
            users: res.users[0],
            ageGroups: this.getAgeGroupsForChart(res.users[1]),
            activitiesGroups: this.getActivitiesForChart(res.users[2]),
            genderNumbers: this.getGendersForChart(res.users[3]),
          },
          () => console.log(this.state.users),
        );
      })
      .catch(() => {
        this.props.history.push('/internalServerError');
      });

  sort = e => this.setState({ orderBy: e.target.value }, this.updateResults);

  filter = group => (e) => {
    const filterBy = `${group}@${e.target.value}`;
    const isAdding = e.target.checked;

    const newFilters = isAdding
      ? [...this.state.filters, filterBy]
      : this.state.filters.filter(filter => filter !== filterBy);

    this.setState({ filters: newFilters }, this.updateResults);
  };

  render() {
    return this.state.auth === 'SUCCESS' ? (
      <section>
        <h1>User Data</h1>
        <form>
          <CheckboxGroup
            title="Filter by Gender"
            values={{
              male: 'Male',
              female: 'Female',
              prefer_not_to_say: 'Prefer not to say',
            }}
            change={this.filter('gender')}
          />
          <CheckboxGroup
            title="Filter by Age"
            values={{
              '0-17': '0-17',
              '18-34': '18-34',
              '35-50': '35-50',
              '51-69': '51-69',
              '70-more': '70-more',
            }}
            change={this.filter('age')}
          />
          <label className="Form__Label" htmlFor="TODO-remove">
            Filter by Activity
            <br />
            {this.state.activities.map(activity => (
              <label key={activity} htmlFor={`user-data-${activity}-input`}>
                <input
                  id={`user-data-${activity}-input`}
                  type="checkbox"
                  value={activity}
                  onChange={this.filter('activity')}
                />
                {activity}
              </label>
            ))}
          </label>
        </form>
        <h4 id="visitChart">Visitor Numbers</h4>
        <div id="barChartDiv">
          <Bar
            data={this.state.visitNumbers}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>
        <table>
          <thead>
            <tr>
              <th>Users by Gender</th>
              <th>Reason for Visiting</th>
              <th>Users by Age Band</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Pie data={this.state.genderNumbers} />
              </td>
              <td>
                <Pie data={this.state.activitiesGroups} />
              </td>
              <td>
                <Pie data={this.state.ageGroups} />
              </td>
            </tr>
          </tbody>
        </table>
        <form>
          <DropdownSelect
            sort={this.sort}
            default={{ date: 'Sort by' }}
            label="Sort by"
            values={{
              name: 'Name',
              yearofbirth: 'Year of Birth',
              sex: 'Gender',
              date: 'Date of Signup',
            }}
          />
        </form>
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Gender</th>
              <th>Year of Birth</th>
              <th>Email</th>
              <th>Date of Signup</th>
            </tr>
          </thead>
          <tbody>
            {this.state.users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  <Link to={`/admin/user/${user.id}`}>{user.fullname}</Link>
                </td>
                <td>{user.sex}</td>
                <td>{user.yearofbirth}</td>
                <td>{user.email}</td>
                <td>
                  {user.date.slice(0, 10)} {user.date.slice(11, 16)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link to="/admin">
          <button className="Button ButtonBack">Back to the admin menu page</button>
        </Link>
        <br />
        <Logoutbutton
          updateLoggedIn={this.props.updateLoggedIn}
          redirectUser={this.props.history.push}
        />
        <br />
      </section>
    ) : (
      <div> CHECKING ADMIN... </div>
    );
  }
}

AdminUsersPage.propTypes = {
  auth: PropTypes.string.isRequired,
  updateAdminToken: PropTypes.func.isRequired,
  updateLoggedIn: PropTypes.func.isRequired,
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
