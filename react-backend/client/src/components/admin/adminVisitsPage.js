import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../visitors/button';
import { Logoutbutton } from '../visitors/logoutbutton';
import { adminPost, adminGet, checkAdmin } from './activitiesLib/admin_helpers';

export class AdminVisitsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: 'PENDING',
      users: [],
      activities: [],
      filters: [],
      orderBy: '',
    };
  }

  setErrorMessage = (error, errorString) => {
    // console.log(error); // Uncomment to display full errors in the console.
    this.setState({ errorMessage: errorString });
  };

  componentDidMount() {
    Promise.all([adminGet(this, '/activities'), adminPost(this, '/all-users')])
      .then(([{ activities }, { users }]) => {
        const activityNames = activities.map(activity => activity.name);
        this.setState({ auth: 'SUCCESS', activities: activityNames, users });
      })
      .catch(error =>
        this.setErrorMessage(error, 'Error fetching activities and users')
      );
  }

  updateResults = () => {
    adminPost(this, '/fetchVisitsFilteredBy', {
      filterBy: this.state.filters,
      orderBy: this.state.orderBy,
    })
      .then(({ users }) => {
        this.setState({ users });
      })
      .catch(error => false);
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

  render() {
    return this.state.auth === 'SUCCESS' ? (
      <div>
        <h1>Visitor Data</h1>
        <form>
          <label className="Form__Label">
            Sort by
            <br />
            <select onChange={this.sort}>
              <option defaultValue value="date">
                Sort by
              </option>
              <option value="yearofbirth">Year of Birth </option>
              <option value="sex">Gender </option>
              <option value="activity">Activity </option>
              <option value="date">Date of visit </option>{' '}
            </select>
          </label>
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
              <th>Visitor ID</th>
              <th>Visitor Gender</th>
              <th>Visitor Year of Birth</th>
              <th>Activity</th>
              <th>Date of Visit</th>
            </tr>
          </thead>
          <tbody>
            {this.state.users.map(user => (
              <tr key={user.date}>
                <td>{user.id}</td>
                <td>{user.sex}</td>
                <td>{user.yearofbirth}</td>
                <td>{user.name}</td>
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
    ) : (
      <div> CHECKING ADMIN... </div>
    );
  }
}
