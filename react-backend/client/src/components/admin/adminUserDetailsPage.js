import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../visitors/button';
import { Logoutbutton } from '../visitors/logoutbutton';
import qrcodelogo from '../../qrcodelogo.png';

export class AdminUserDetailsPage extends Component {
  constructor(props) {
    super(props);
    const userId = this.props.match.params.userId;

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
      url: ''
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
      reauthenticated: true,
      errorMessage: ''
    });
  };

  submitConfirmation = () => {
    this.setState({
      successMessage: 'The user details have been successfully updated'
    });
    setTimeout(() => {
      this.setState({ successMessage: '' });
    }, 5000);
  };

  headers = new Headers({
    Authorization: localStorage.getItem('token'),
    'Content-Type': 'application/json'
  });

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
      errorMessage: ''
    });
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

  handleEmptySubmit = event => {
    event.preventDefault();
    this.setState({
      errorMessage: 'Please do not leave empty input fields'
    });
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
      .then(this.submitConfirmation)
      .catch(error => {
        this.props.history.push('/internalServerError');
      });
  };

  displayQR = () => {
    fetch('/qr-user-gen', {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        hash: this.state.hash,
        password: this.state.password
      })
    })
      .then(this.handleFetchError)
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          return res.qr;
        } else if (res.error === 'Not logged in') {
          throw new Error('Not logged in');
        } else {
          this.setState({ failure: true });
          throw new Error('password');
        }
      })
      .then(qr =>
        this.setState({
          url: qr
        })
      )
      .catch(error => {
        if (!this.state.failure) {
          this.props.history.push('/logincb');
        } else if (error === '500') {
          this.props.history.push('/internalServerError');
        }
      });
  };

  resendQR = () => {
    fetch('/qr-send', {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        email: this.state.email,
        name: this.state.userFullName,
        hash: this.state.hash,
        password: this.state.password
      })
    })
      .then(this.handleFetchError)
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          this.setState({
            successMessage: 'The email has been successfully resent'
          });
          setTimeout(() => {
            this.setState({ successMessage: '' });
          }, 5000);
          console.log('Sucess!');
        } else if (res.error === 'Not logged in') {
          throw new Error('Not logged in');
        } else {
          this.setState({ failure: true });
          throw new Error('password');
        }
      })
      .catch(error => {
        if (!this.state.failure) {
          this.props.history.push('/logincb');
        } else if (error === '500') {
          this.props.history.push('/internalServerError');
        }
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
        <div className="hidden-printer">
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
            <div>
              <img
                className="QR__image"
                src={this.state.url}
                alt="This is your QRcode"
              />
              <button className="Button" onClick={window.print}>
                Print QR Code
              </button>
              <br />
              {this.state.successMessage ===
                'The email has been successfully resent' && (
                <span className="SuccessText">{this.state.successMessage}</span>
              )}
              <button className="Button" onClick={this.resendQR}>
                Re-email QR Code
              </button>
            </div>
          </div>
          <h2>Edit {this.state.userFullName}s Details</h2>
          {this.state.errorMessage && (
            <span className="ErrorText">{this.state.errorMessage}</span>
          )}

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
            {this.state.successMessage ===
              'The user details have been successfully updated' && (
              <span className="SuccessText">{this.state.successMessage}</span>
            )}
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
        <div className="visible-printer qr-code-to-print">
          <div className="dashed">
            <img height="182" src={qrcodelogo} alt="Power to change Logo" />
            <img
              className="QR__image"
              src={this.state.url}
              alt="This is your QRcode"
            />
            <h5>
              Please print this QR code and <br /> bring it with you to access
              next time
            </h5>
          </div>
        </div>
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
