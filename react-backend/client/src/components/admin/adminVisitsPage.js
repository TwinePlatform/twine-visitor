import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Logoutbutton from '../visitors/logoutbutton';
import { adminPost, adminGet } from './activitiesLib/admin_helpers';
import { DropdownSelect, CheckboxGroup } from './filter_components/UserInputs';

export default class AdminVisitsPage extends Component {
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

  componentDidMount() {
    Promise.all([adminGet(this, '/api/activities/all'), adminPost(this, '/api/visitors/all')])
      .then(([{ activities }, { users }]) => {
        const activityNames = activities.map(activity => activity.name);
        this.setState({ auth: 'SUCCESS', activities: activityNames, users });
      })
      .catch(error => this.setErrorMessage(error, 'Error fetching activities and users'));
  }

  setErrorMessage = (error, errorString) => {
    // console.log(error); // Uncomment to display full errors in the console.
    this.setState({ errorMessage: errorString });
  };

  updateResults = () => {
    adminPost(this, '/api/visitors/filtered', {
      filterBy: this.state.filters,
      orderBy: this.state.orderBy,
    })
      .then(({ users }) => {
        this.setState({ users });
      })
      .catch(() => false); // TODO: What is this supposed to do?
  };

  sort = (e) => {
    this.setState(
      { orderBy: e.target.value },
      this.updateResults,
    );
  };

  filter = group => (e) => {
    const filterBy = `${group}@${e.target.value}`;
    const isAdding = e.target.checked;

    const newFilters = isAdding
      ? [...this.state.filters, filterBy]
      : this.state.filters.filter(filter => filter !== filterBy);

    this.setState(
      {
        filters: newFilters,
      },
      this.updateResults,
    );
  };

  render() {
    return this.state.auth === 'SUCCESS' ? (
      <div>
        <h1>Visitor Data</h1>

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
          <button className="Button ButtonBack">Back to the admin menu page</button>
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

AdminVisitsPage.propTypes = {
  updateLoggedIn: PropTypes.func.isRequired,
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
