import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../visitors/button';
import { Logoutbutton } from '../visitors/logoutbutton';

export class AdminUserDetailsPage extends Component {
  constructor(props) {
    super(props);
    const userId = this.props.location.pathname.split('/').reverse()[0];

    this.state = {
      reauthenticated: false,
      failure: false,
      password: '',
      userId,
      userFullName: '',
      sex: '',
      yearOfBirth: '',
      email: '',
      signupDate: '',
      hash: ''
    };
  }

  setUser = user => {
    this.setState({
      userFullName: user.fullname,
      sex: user.sex,
      yearOfBirth: user.yearofbirth,
      email: user.email,
      signupDate: user.date
        .split('T')
        .join(' ')
        .slice(0, 19),
      hash: user.hash,
      reauthenticated: true
    });
  };

  headers = new Headers({
    Authorization: localStorage.getItem('token'),
    'Content-Type': 'application/json'
  });

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleChangeSex = e => {
    this.setState({ sex: e.target.value });
  };

  handleFetchError = res => {
    if (res.status === 500) throw new Error();
    return res;
  };

  setErrorMessage = (error, errorString) => {
    // console.log(error) // Uncomment to display full errors in the console.
    this.setState({ errorMessage: errorString });
  };

  handleSubmit = event => {
    event.preventDefault();
    fetch('/fetchNewUserDetails', {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        userId: this.state.userId,
        userFullName: this.state.userFullName,
        sex: this.state.sex,
        yearOfBirth: this.state.yearOfBirth,
        email: this.state.email,
        password: this.state.password
      })
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

    fetch('/user-details', {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        password: this.state.password,
        userId: this.state.userId
      })
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
        <h1>{this.state.userFullName}s Details</h1>
        <table>
          <tbody>
            <tr>
              <td>User Id</td>
              <td>{this.state.userId}</td>
            </tr>
            <tr>
              <td> User Full Name </td>
              <td>{this.state.userFullName}</td>
            </tr>
            <tr>
              <td>User Sex</td>
              <td>{this.state.sex}</td>
            </tr>
            <tr>
              <td> User Year of Birth </td>
              <td>{this.state.yearOfBirth}</td>
            </tr>
            <tr>
              <td>User email</td>
              <td>{this.state.email}</td>
            </tr>
            <tr>
              <td>User Signup Date</td>
              <td>{this.state.signupDate}</td>
            </tr>
          </tbody>
        </table>
        <h2>Edit {this.state.userFullName}s Details</h2>

        <form>
          <label className="Form__Label">
            Edit Full Name
            <input
              className="Form__Input"
              type="text"
              name="userFullName"
              onChange={this.handleChange}
              value={this.state.userFullName}
            />
          </label>
          <label className="Form__Label">
            Edit Sex
            <select className="Form__Input" onChange={this.handleChangeSex}>
              <option defaultValue value={this.state.sex}>
                Change sex: {this.state.sex}
              </option>
              <option value="prefer not to say">prefer not to say</option>
              <option value="male">male</option>
              <option value="female">female</option>
            </select>
          </label>
          <label className="Form__Label">
            Edit Year of Birth
            <input
              type="text"
              className="Form__Input"
              name="yearOfBirth"
              onChange={this.handleChange}
              value={this.state.yearOfBirth}
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
          <button className="Button" onClick={this.handleSubmit}>
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
