import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Logoutbutton } from '../visitors/logoutbutton';
import { adminGet, adminPost } from './activitiesLib/admin_helpers';
import { DropdownSelect, CheckboxGroup } from './filter_components/UserInputs';

const PieChart = require('react-chartjs').Pie;
const BarChart = require('react-chartjs').Bar;

export class AdminUsersPage extends Component {
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

  getColorPair = index => {
    const colors = [
      {
        color: '#F7464A',
        highlight: '#FF5A5E',
      },
      {
        color: '#46BFBD',
        highlight: '#5AD3D1',
      },
      {
        color: '#FDB45C',
        highlight: '#FFC870',
      },
      {
        color: '#949FB1',
        highlight: '#A8B3C5',
      },
      {
        color: '#4D5360',
        highlight: '#616774',
      },
    ];
    return colors[index % colors.length];
  };

  setErrorMessage = (error, errorString) => {
    // console.log(error) // Uncomment to display full errors in the console.
    this.setState({ errorMessage: errorString });
  };

  getActivitiesForChart = activities => {
    if (!activities) return [];

    return activities.map(({ name, count }, index) => ({
      value: count,
      color: this.getColorPair(index).color,
      highlight: this.getColorPair(index).highlight,
      label: name,
    }));
  };

  getGendersForChart = genders => {
    if (!genders) return [];

    return genders.map(({ sex, count }, index) => ({
      value: count,
      color: this.getColorPair(index).color,
      highlight: this.getColorPair(index).highlight,
      label: sex,
    }));
  };

  getVisitsWeek = visits => {
    if (!visits) return [];
    let visitCount = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
    };

    Object.values(visits).forEach(function(key) {
      if (key.date > Date.now() - 691200000) {
        let num = new Date(key.date);
        visitCount[num.getDay()]++;
      }
    });

    let dayName = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];

    const buildDaysWithOffset = (num, array) => {
      return Array.from({ length: 7 }, (_, index) => array[(index + num) % 7]);
    };

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

  getAgeGroupsForChart = ageGroups => {
    if (!ageGroups) return [];
    return ageGroups.map(({ agegroups, agecount }, index) => ({
      value: agecount,
      color: this.getColorPair(index).color,
      highlight: this.getColorPair(index).highlight,
      label: agegroups,
    }));
  };

  componentDidMount() {
    adminGet(this, '/users/chart-all')
      .then(res => res.numbers)
      .then(
        ([
          visitsNumbers,
          genderNumbers,
          activitiesNumbers,
          ageGroups,
          activities,
        ]) => {
          this.setState({
            visits: visitsNumbers,
            visitNumbers: this.getVisitsWeek(visitsNumbers),
            genderNumbers: this.getGendersForChart(genderNumbers),
            activitiesGroups: this.getActivitiesForChart(activitiesNumbers),
            ageGroups: this.getAgeGroupsForChart(ageGroups),
            activities: activities.map(activity => activity.name),
          });

          return adminGet(this, '/users/all');
        }
      )
      .then(({ users }) => this.setState({ auth: 'SUCCESS', users }))
      .catch(error =>
        this.setErrorMessage(error, 'Error fetching gender numbers')
      );
  }

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  updateResults = () =>
    adminPost(this, '/users/filtered', {
      filterBy: this.state.filters,
      orderBy: this.state.orderBy,
    })
      .then(res => {
        this.setState(
          {
            users: res.users[0],
            ageGroups: this.getAgeGroupsForChart(res.users[1]),
            activitiesGroups: this.getActivitiesForChart(res.users[2]),
            genderNumbers: this.getGendersForChart(res.users[3]),
          },
          () => console.log(this.state.users)
        );
      })
      .catch(error => {
        this.props.history.push('/internalServerError');
      });

  sort = e => this.setState({ orderBy: e.target.value }, this.updateResults);

  filter = group => e => {
    const filterBy = group + '@' + e.target.value;
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
          <label className="Form__Label">
            Filter by Activity
            <br />
            {this.state.activities.map(activity => (
              <label key={activity}>
                <input
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
          <BarChart
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
                <PieChart data={this.state.genderNumbers} />
              </td>
              <td>
                <PieChart data={this.state.activitiesGroups} />
              </td>
              <td>
                <PieChart data={this.state.ageGroups} />
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
          <button className="Button ButtonBack">
            Back to the admin menu page
          </button>
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
