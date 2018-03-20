import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from '../visitors/button';
import { CbAdmin } from '../../api';

export default class AdminLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      errorMessage: '',
    };
  }

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  authenticate = async (e) => {
    e.preventDefault();

    try {
      const localToken = localStorage.getItem('token');
      const res = await CbAdmin.login(localToken, { password: this.state.password });
      const { success, token, reason } = res.data;

      if (!success || !token || reason) {
        throw new Error(reason || 'Incorrect password');
      }

      await this.props.updateAdminToken(token);

      return this.props.history.push('/admin');
    } catch (error) {
      if (error.message === 'Incorrect password') {
        return this.setState({
          errorMessage: 'Incorrect password. Please try again.',
        });
      }

      return console.log(error);
    }
  };

  render() {
    return (
      <div>
        <div className="ErrorText">{this.state.errorMessage}</div>
        <form className="Signup" onSubmit={this.authenticate}>
          <label className="Form__Label" htmlFor="admin-login-password">
            Please, type your password
            <input
              id="admin-login-password"
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

AdminLogin.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
  updateAdminToken: PropTypes.func.isRequired,
};
