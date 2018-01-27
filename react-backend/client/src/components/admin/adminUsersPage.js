import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Logoutbutton } from '../visitors/logoutbutton';
import { adminGet, adminPost } from './activitiesLib/admin_helpers';
import { DropdownSelect, CheckboxGroup } from './filter_components/UserInputs';

export class AdminUsersPage extends Component {
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
    adminGet(this, '/users-all')
      .then(({ users }) => this.setState({ auth: 'SUCCESS', users }))
      .catch(error => false);
  }

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  updateResults = () =>
    adminPost(this, '/fetchUsersFilteredBy', {
      filterBy: this.state.filters,
      orderBy: this.state.orderBy,
    })
      .then(({ users }) => this.setState({ users }))
      .catch(error => null);

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
