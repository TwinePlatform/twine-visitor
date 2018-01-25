import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../visitors/button';
import { Logoutbutton } from '../visitors/logoutbutton';

const PieChart = require('react-chartjs').Pie;
const BarChart = require('react-chartjs').Bar;

export class AdminUsersPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      reauthenticated: false,
      failure: false,
      password: '',
      filters: [],
      orderBy: '',
      genderNumbers: [],
      visits: [],
      visitNumbers: {
        labels: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
        ],
        datasets: [
          {
            label: 'My First dataset',
            fillColor: 'rgba(220,220,220,0.5)',
            strokeColor: 'rgba(220,220,220,0.8)',
            highlightFill: 'rgba(220,220,220,0.75)',
            highlightStroke: 'rgba(220,220,220,1)',
            data: [65, 59, 80, 81, 56, 55, 40],
          },
          {
            label: 'My Second dataset',
            fillColor: 'rgba(151,187,205,0.5)',
            strokeColor: 'rgba(151,187,205,0.8)',
            highlightFill: 'rgba(151,187,205,0.75)',
            highlightStroke: 'rgba(151,187,205,1)',
            data: [28, 48, 40, 19, 86, 27, 90],
          },
        ],
      },
      ageGroups: [],
      activitiesGroups: [],
      activities: [],
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
      color: this.getColorPair(index)[0],
      highlight: this.getColorPair(index)[1],
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

    let dayName = {
      0: 'Monday',
      1: 'Tuesday',
      2: 'Wednesday',
      3: 'Thursday',
      4: 'Friday',
      5: 'Saturday',
      6: 'Sunday',
    };

    visits.map({ date }, index => {
      if (date > Date.now() - 604800000) {
        visitCount[date.getDay()]++;
      }
    });
  };

  getAgeGroupsForChart = ageGroups => {
    if (!ageGroups) return [];
    return ageGroups.map(({ agegroups, agecount }, index) => ({
      value: agecount,
      color: this.getColorPair(index)[0],
      highlight: this.getColorPair(index)[1],
      label: agegroups,
    }));
  };

  componentDidMount() {
    fetch('/getGenderNumbers', {
      method: 'GET',
      headers: this.headers,
    })
      .then(this.handleFetchError)
      .then(res => res.json())
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
            // visitNumbers: this.getVisitsWeek(this.state.visits),
            genderNumbers: this.getGendersForChart(genderNumbers),
            activitiesGroups: this.getActivitiesForChart(activitiesNumbers),
            ageGroups: this.getAgeGroupsForChart(ageGroups),
            activities: activities.map(activity => activity.name),
          });
        }
      )
      .catch(error =>
        this.setErrorMessage(error, 'Error fetching gender numbers')
      );
  }

  headers = new Headers({
    Authorization: localStorage.getItem('token'),
    'Content-Type': 'application/json',
  });

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleFetchError = res => {
    if (res.status === 500) throw new Error();
    return res;
  };

  setErrorMessage = (error, errorString) => {
    // console.log(error) // Uncomment to display full errors in the console.
    this.setState({ errorMessage: errorString });
  };

  updateResults = () => {
    fetch('/fetchUsersFilteredBy', {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        filterBy: this.state.filters,
        orderBy: this.state.orderBy,
      }),
    })
      .then(this.handleFetchError)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        this.setState({
          users: res.users[0],
          ageGroups: this.getAgeGroupsForChart(res.users[1]),
          activitiesGroups: this.getActivitiesForChart(res.users[2]),
          genderNumbers: this.getGendersForChart(res.users[3]),
        });
      })
      .catch(error => {
        this.props.history.push('/internalServerError');
      });
  };

  sort = e => {
    this.setState(
      {
        orderBy: e.target.value,
      },
      this.updateResults
    );
  };

  filter = group => e => {
    const filterBy = group + '@' + e.target.value;
    const isAdding = e.target.checked;

    const newFilters = isAdding
      ? [...this.state.filters, filterBy]
      : this.state.filters.filter(filter => filter !== filterBy);

    this.setState(
      {
        filters: newFilters,
      },
      this.updateResults
    );
  };

  authenticate = event => {
    event.preventDefault();

    fetch('/users-all', {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ password: this.state.password }),
    })
      .then(this.handleFetchError)
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          return res.users;
        } else if (res.error === 'Not logged in') {
          throw new Error('Not logged in');
        } else {
          this.setState({ failure: true });
          throw new Error('password');
        }
      })
      .then(users => {
        this.setState({ users, reauthenticated: true });
      })
      .catch(error => {
        if (!this.state.failure) {
          this.props.history.push('/logincb');
        } else if (error === '500') {
          this.props.history.push('/internalServerError');
        }
      });
  };

  passwordError = <span>The password is incorrect. Please try again.</span>;

  renderAuthenticated = () => {
    return (
      <div>
        <h1>User Data</h1>
        <form>
          <label className="Form__Label">
            Filter by Gender
            <br />
            <label>
              <input
                type="checkbox"
                value="male"
                onChange={this.filter('gender')}
              />
              Male
            </label>
            <label>
              <input
                type="checkbox"
                value="female"
                onChange={this.filter('gender')}
              />
              Female
            </label>
            <label>
              <input
                type="checkbox"
                value="prefer_not_to_say"
                onChange={this.filter('gender')}
              />
              Prefer not to say
            </label>
          </label>
          <label className="Form__Label">
            Filter by age
            <br />
            <label>
              <input
                type="checkbox"
                value="0-17"
                onChange={this.filter('age')}
              />
              0-17
            </label>
            <label>
              <input
                type="checkbox"
                value="18-34"
                onChange={this.filter('age')}
              />
              18-34
            </label>
            <label>
              <input
                type="checkbox"
                value="35-50"
                onChange={this.filter('age')}
              />
              35-50
            </label>
            <label>
              <input
                type="checkbox"
                value="51-69"
                onChange={this.filter('age')}
              />
              51-69
            </label>
            <label>
              <input
                type="checkbox"
                value="70-more"
                onChange={this.filter('age')}
              />
              70-more
            </label>
          </label>
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
              <td>
                <BarChart data={this.state.visitNumbers} />
              </td>
            </tr>
          </tbody>
        </table>
        <form>
          <label className="Form__Label">
            Sort by
            <br />
            <select onChange={this.sort}>
              <option defaultValue value="date">
                Sort by
              </option>
              <option value="name">Name </option>
              <option value="yearofbirth">Year of Birth </option>
              <option value="sex">Gender </option>
              <option value="date">Date of Signup </option>{' '}
            </select>
          </label>
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
      </div>
    );
  };

  renderNotAuthenticated = () => {
    return (
      <div>
        <div className="ErrorText">
          {this.state.failure ? this.passwordError : ''}
        </div>
        <form className="Signup" onSubmit={this.authenticate}>
          <label className="Form__Label">
            Please, type your password
            <input
              className="Form__Input"
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
            />
          </label>
          <Button />
        </form>
        <Link to="/pswdresetcb">
          <button className="Button ButtonBack">Reset Password</button>
        </Link>
      </div>
    );
  };

  render() {
    return this.renderAuthenticated();
    return this.state.reauthenticated
      ? this.renderAuthenticated()
      : this.renderNotAuthenticated();
  }
}
