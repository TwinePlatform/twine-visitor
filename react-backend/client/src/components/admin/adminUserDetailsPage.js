import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Logoutbutton } from '../visitors/logoutbutton';
import qrcodelogo from '../../qrcodelogo.png';
import { adminPost } from './activitiesLib/admin_helpers';

export class AdminUserDetailsPage extends Component {
  constructor(props) {
    super(props);
    const userId = this.props.match.params.userId;

    this.state = {
      auth: 'PENDING',
      userId,
      userFullName: '',
      sex: '',
      yearOfBirth: '',
      email: '',
      signupDate: '',
      hash: '',
      url: '',
      errorMessage: '',
      cb_logo: '',
    };
  }

  componentDidMount() {
    adminPost(this, '/api/user/details', {
      userId: this.state.userId,
    })
      .then(res => {
        this.setState({ auth: 'SUCCESS' });
        return res.details[0];
      })
      .then(this.setUser)
      .then(this.displayQR)
      .catch(error => {
        if (error.message === 500) {
          this.props.history.push('/internalServerError');
        } else if (error.message === 'No admin token') {
          this.props.history.push('/admin/login');
        } else {
          this.props.history.push('/admin/login');
        }
      });
  }

  setUser = ({ fullname, sex, yearofbirth, email, date, hash }) => {
    this.setState({
      userFullName: fullname,
      sex,
      yearOfBirth: yearofbirth,
      email: email,
      signupDate: date.replace(/T/g, ' ').slice(0, 19),
      hash,
      errorMessage: '',
    });
  };

  submitConfirmation = () => {
    this.setState({
      successMessage: 'The user details have been successfully updated',
    });
  };

  handleChange = e =>
    this.setState({
      [e.target.name]: e.target.value,
      errorMessage: '',
      successMessage: '',
    });

  handleChangeSex = e => this.setState({ sex: e.target.value });

  handleEmptySubmit = event => {
    event.preventDefault();
    this.setState({
      errorMessage: 'Please do not leave empty input fields',
    });
  };

  handleSubmit = event => {
    event.preventDefault();

    adminPost(this, '/api/user/details/update', {
      userId: this.state.userId,
      userFullName: this.state.userFullName,
      sex: this.state.sex,
      yearOfBirth: this.state.yearOfBirth,
      email: this.state.email,
    })
      .then(res => res.details)
      .then(this.setUser)
      .then(this.submitConfirmation)
      .catch(error => this.props.history.push('/internalServerError'));
  };

  displayQR = () => {
    adminPost(this, '/api/user/qr', {
      hash: this.state.hash,
    })
      .then(res => {
        if (res.qr)
          return this.setState({
            url: res.qr,
            cb_logo: res.cb_logo,
          });
        throw new Error('Unknown error generating QR');
      })
      .catch(error => {
        console.log('Error', error);
        this.props.history.push('/internalServerError');
      });
  };

  resendQR = () => {
    adminPost(this, '/api/user/qr/email', {
      email: this.state.email,
      name: this.state.userFullName,
      hash: this.state.hash,
    })
      .then(res => {
        if (res.success) {
          return this.setState({
            successMessage: 'The email has been successfully resent',
          });
        }
        throw new Error('Error sending email');
      })
      .catch(error => this.props.history.push('/internalServerError'));
  };

  render() {
    const submitHandler =
      this.state.userFullName && this.state.sex && this.state.yearOfBirth && this.state.email
        ? this.handleSubmit
        : this.handleEmptySubmit;

    return this.state.auth === 'SUCCESS' ? (
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
              <img className="QR__image" src={this.state.url} alt="This is your QRcode" />
              <button className="Button" onClick={window.print}>
                Print QR Code
              </button>
              <br />
              {this.state.successMessage === 'The email has been successfully resent' && (
                <span className="SuccessText">{this.state.successMessage}</span>
              )}
              <button className="Button" onClick={this.resendQR}>
                Re-email QR Code
              </button>
            </div>
          </div>
          <h2>Edit {this.state.userFullName}s Details</h2>
          {this.state.errorMessage && <span className="ErrorText">{this.state.errorMessage}</span>}

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
            {this.state.successMessage === 'The user details have been successfully updated' && (
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
            {this.state.cb_logo ? (
              <img height="182" src={this.state.cb_logo} alt="Community business logo" />
            ) : (
              <img height="182" src={qrcodelogo} alt="Power to change Logo" />
            )}
            <img className="QR__image" src={this.state.url} alt="This is your QRcode" />
            <h5>
              Please print this QR code and <br /> bring it with you to access next time
            </h5>
          </div>
        </div>
      </div>
    ) : (
      <div>Checking admin authentication</div>
    );
  }
}

AdminUserDetailsPage.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
  updateLoggedIn: PropTypes.func.isRequired,
  match: PropTypes.shape({ params: PropTypes.object }).isRequired,
};
