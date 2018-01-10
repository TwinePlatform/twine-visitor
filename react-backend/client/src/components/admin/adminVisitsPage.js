import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../visitors/button';
import { Logoutbutton } from '../visitors/logoutbutton';

export class AdminVisitsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      reauthenticated: false,
      failure: false,
      password: ''
    };
  }

  headers = new Headers({
    Authorization: localStorage.getItem('token'),
    'Content-Type': 'application/json'
  });

  handleChange = e => {
    let newState = {};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  };

  updateResults = filterBy => {
    fetch('/fetchVisitsFilteredBy', {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ filterBy })
    })
      .then(res => {
        if (res.status === 500) {
          throw new Error('500');
        } else {
          return res.json();
        }
      })
      .then(users => {
        this.setState(users);
      })
      .catch(error => {
        this.props.history.push('/internalServerError');
      });
  };

  filter = e => {
    const filterBy = e.target.value;
    this.updateResults(filterBy);
  };

  authenticate = event => {
    event.preventDefault();

    fetch('/all-users', {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ password: this.state.password })
    })
      .then(res => {
        if (res.status === 500) {
          throw new Error('500');
        } else {
          return res.json();
        }
      })
      .then(res => {
        if (res.success) {
          return res.users;
        } else {
          if (res.error === 'Not logged in') {
            throw new Error('Not logged in');
          } else {
            this.setState({ failure: true });
            throw new Error('password');
          }
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

  render() {
    return this.state.reauthenticated ? (
      <div>
        <h1>Visitor Data</h1>
        <select onChange={this.filter}>
          <option defaultValue value="date">
            Sort by
          </option>
          <option value="yearofbirth">Year of Birth </option>
          <option value="sex">Gender </option>
          <option value="activity">Activity </option>
          <option value="date">Date of visit </option>
        </select>
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
              onChange={this.handleChange}
              value={this.state.password}
            />
          </label>
          <Button />
        </form>
        <Link to="/pswdresetcb">
          <button className="Button ButtonBack">Reset Password</button>
        </Link>
      </div>
    );
  }
}
