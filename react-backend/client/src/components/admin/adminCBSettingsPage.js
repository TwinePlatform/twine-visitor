import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../visitors/button';
import { Logoutbutton } from '../visitors/logoutbutton';

export class AdminCBSettingsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reauthenticated: false,
      failure: false,
      password: '',
      org_name: '',
      genre: '',
      email: '',
      signupDate: '',
    };
  }

  setCB = cb => {
    this.setState({
      org_name: cb.org_name,
      genre: cb.genre,
      email: cb.email,
      signupDate: cb.date
        .split('T')
        .join(' ')
        .slice(0, 19),
      reauthenticated: true,
      errorMessage: '',
    });
  };

  headers = new Headers({
    Authorization: localStorage.getItem('token'),
    'Content-Type': 'application/json',
  });

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
      errorMessage: '',
    });
  };

  handleFetchError = res => {
    if (res.status === 500) throw new Error();
    return res;
  };

  setErrorMessage = (error, errorString) => {
    // console.log(error) // Uncomment to display full errors in the console.
    this.setState({ errorMessage: errorString });
  };

  handleEmptySubmit = event => {
    event.preventDefault();
    this.setState({
      errorMessage: 'Please do not leave empty input fields',
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    fetch('/fetchNewCBDetails', {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        org_name: this.state.org_name,
        genre: this.state.genre,
        email: this.state.email,
        password: this.state.password,
      }),
    })
      .then(this.handleFetchError)
      .then(res => res.json())
      .then(res => res.details)
      .then(this.setUser)
      .catch(error => {
        this.props.history.push('/internalServerError');
      });
  };

  authenticate = event => {
    event.preventDefault();

    fetch('/cb-details', {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        password: this.state.password,
      }),
    })
      .then(this.handleFetchError)
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          return res.details;
        } else if (res.error === 'Not logged in') {
          throw new Error('Not logged in');
        } else {
          this.setState({ failure: true });
          throw new Error('password');
        }
      })
      .then(details => details[0])
      .then(this.setUser)
      .then(this.displayQR)
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
    const submitHandler =
      this.state.userFullName &&
      this.state.sex &&
      this.state.yearOfBirth &&
      this.state.email
        ? this.handleSubmit
        : this.handleEmptySubmit;

    return (
      <div>
        <div>
          <h1>{this.state.org_name}s Details</h1>
          <table>
            <tbody>
              <tr>
                <td>Business Id</td>
                <td>{this.auth.cb_id}</td>
              </tr>
              <tr>
                <td> Business Name </td>
                <td>{this.state.org_name}</td>
              </tr>
              <tr>
                <td> Type of Business </td>
                <td>{this.state.genre}</td>
              </tr>
              <tr>
                <td>Business email</td>
                <td>{this.state.email}</td>
              </tr>
              <tr>
                <td>Business Registration Date</td>
                <td>{this.state.signupDate}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h2>Edit {this.state.org_name}s Details</h2>
        {this.state.errorMessage && (
          <span className="ErrorText">{this.state.errorMessage}</span>
        )}

        <form>
          <label className="Form__Label">
            Edit Business Name
            <input
              className="Form__Input"
              type="text"
              name="org_name"
              onChange={this.handleChange}
              value={this.state.org_name}
            />
          </label>
          <label className="Form__Label">
            Edit Type of Business
            <input
              type="text"
              className="Form__Input"
              name="genre"
              onChange={this.handleChange}
              value={this.state.genre}
            />
          </label>

          <label className="Form__Label">
            Edit Email
            <input
              className="Form__Input"
              type="text"
              name="email"
              onChange={this.handleChange}
              value={this.state.email}
            />
          </label>
          <button className="Button" onClick={submitHandler}>
            Submit
          </button>
        </form>

        <Link to="/admin/users">
          <button className="Button ButtonBack">Back to all users</button>
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
    return this.state.reauthenticated
      ? this.renderAuthenticated()
      : this.renderNotAuthenticated();
  }
}
