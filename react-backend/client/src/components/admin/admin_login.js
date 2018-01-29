import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../visitors/button';
import { authenticatedPost } from './activitiesLib/admin_helpers';

export class AdminLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      errorMessage: '',
    };
  }

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  authenticate = async e => {
    e.preventDefault();

    try {
      const { success, token, error } = await authenticatedPost(
        '/isAdminAuthenticated',
        {
          password: this.state.password,
        }
      );

      if (!success || !token || error) {
        throw new Error(error || 'Incorrect password');
      }

      await this.props.updateAdminToken(token);

      this.props.history.push('/admin');
    } catch (error) {
      if (error.message === 'Incorrect password') {
        return this.setState({
          errorMessage: 'Incorrect password. Please try again.',
        });
      }

      console.log(error);
    }
  };

  render() {
    return (
      <div>
        <div className="ErrorText">{this.state.errorMessage}</div>
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
