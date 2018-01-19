import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../visitors/button';
import { Logoutbutton } from '../visitors/logoutbutton';

export class AdminMenuPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      reauthenticated: false,
      failure: false,
      password: '',
    };
  }

  handleChange = e => {
    let newState = {};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  };

  authenticate = event => {
    event.preventDefault();
    const headers = new Headers({
      Authorization: localStorage.getItem('token'),
      'Content-Type': 'application/json',
    });
    fetch('/isAdminAuthenticated', {
      method: 'POST',
      headers,
      body: JSON.stringify({ password: this.state.password }),
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
          this.setState({ reauthenticated: true });
        } else {
          if (res.error === 'Not logged in') {
            throw new Error('Not logged in');
          } else {
            this.setState({ failure: true });
            throw new Error('password');
          }
        }
      })
      .catch(error => {
        if (!this.state.failure) {
          this.props.history.push('/logincb');
        } else if (error === '500') {
          this.props.history.push('/internalServerError');
        } else if (error.message === 'Not logged in') {
          this.props.history.push('/logincb');
        }
      });
  };

  passwordError = <span>The password is incorrect. Please try again.</span>;

  render() {
    return this.state.reauthenticated ? (
      <div>
        <h1>
          Welcome admin! <br /> Where do you want to go?<br />
        </h1>
        <Link to="/admin/activities">
          <button className="Button">Activities</button>
        </Link>
        <br />
        <Link to="/admin/visits">
          <button className="Button">Visits</button>
        </Link>
        <br />
        <Link to="/admin/users">
          <button className="Button">Users</button>
        </Link>
        <br />
        <Link to="/admin/accountSettings">
          <button className="Button">Account Settings</button>
        </Link>
        <br />
        <Link to="/">
          <button className="Button ButtonBack">Back to the main page</button>
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
