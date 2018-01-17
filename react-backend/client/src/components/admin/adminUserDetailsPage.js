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
      hash: '',
      url: '',
    };
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
    fetch('/fetchNewUserDetails', {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        userId: this.state.userId,
        userFullName: this.state.userFullName,
        sex: this.state.sex,
        yearOfBirth: this.state.yearOfBirth,
        email: this.state.email,
      }),
    })
      .then(this.handleFetchError)
      .then(res => res.json())
      .then(details => {
        this.setState({
          userFullName: details.fullname,
          sex: details.sex,
          yearOfBirth: details.yearofbirth,
          email: details.email,
          signupDate: details.date,
          hash: details.hash,
          reauthenticated: true,
        });
      })
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
        userId: this.state.userId,
      }),
    })
      .then(this.handleFetchError)
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          console.log(res);
          return res.details;
        } else if (res.error === 'Not logged in') {
          throw new Error('Not logged in');
        } else {
          this.setState({ failure: true });
          throw new Error('password');
        }
      })
      .then(details => {
        this.setState({
          userFullName: details[0].fullname,
          sex: details[0].sex,
          yearOfBirth: details[0].yearofbirth,
          email: details[0].email,
          signupDate: details[0].date,
          hash: details[0].hash,
          reauthenticated: true,
        });
      })
      .catch(error => {
        if (!this.state.failure) {
          this.props.history.push('/logincb');
        } else if (error === '500') {
          this.props.history.push('/internalServerError');
        }
      });

    // fetch('/qr-user-gen', {
    //   method: 'POST',
    //   headers: this.headers,
    //   body: JSON.stringify({
    //     password: this.state.password,
    //     hash: this.state.hash,
    //   }),
    // })
    //   .then(this.handleFetchError)
    //   .then(res => res.json())
    //   .then(res => {
    //     if (res.success) {
    //       console.log(res);
    //       return res.qr;
    //     } else if (res.error === 'Not logged in') {
    //       throw new Error('Not logged in');
    //     } else {
    //       this.setState({ failure: true });
    //       throw new Error('password');
    //     }
    //   })
    //   .then(qr => {
    //     console.log(qr);
    //     this.setState({
    //       url: qr,
    //     });
    //   })
    //   .catch(error => {
    //     if (!this.state.failure) {
    //       this.props.history.push('/logincb');
    //     } else if (error === '500') {
    //       this.props.history.push('/internalServerError');
    //     }
    //   });
  };

  passwordError = <span>The password is incorrect. Please try again.</span>;

  renderAuthenticated = () => {
    return (
      <div>
        <h1 className="capitalise">{this.state.userFullName}'s Details</h1>
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Gender</th>
              <th>Year of Birth</th>
              <th>Email</th>
              <th>Date of Signup</th>
              <th>QR Hash</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{this.state.userId}</td>
              <td>{this.state.userFullName}</td>
              <td>{this.state.sex}</td>
              <td>{this.state.yearOfBirth}</td>
              <td>{this.state.email}</td>
              <td>{this.state.signupDate}</td>
              <td>{this.state.hash}</td>
            </tr>
            <tr id="edit__row">
              <td />
              <td>
                <form>
                  <input
                    type="text"
                    name="name"
                    placeholder={this.state.userFullName}
                  />
                </form>
              </td>
              <td>
                <form>
                  <input type="text" name="sex" placeholder={this.state.sex} />
                </form>
              </td>
              <td>
                <form>
                  <input
                    type="text"
                    name="yob"
                    placeholder={this.state.yearOfBirth}
                  />
                </form>
              </td>
              <td>
                <form>
                  <input
                    type="text"
                    name="email"
                    placeholder={this.state.email}
                  />
                </form>
              </td>
              <td />
              <td />
            </tr>
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
    return this.state.reauthenticated
      ? this.renderAuthenticated()
      : this.renderNotAuthenticated();
  }
}
