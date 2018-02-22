import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class Logoutbutton extends Component {
  logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    this.props.updateLoggedIn();
    this.props.redirectUser('/logincb');
  };

  render() {
    return (
      <button className="Logoutbutton" type="submit" onClick={this.logout}>
        Log out
      </button>
    );
  }
}

Logoutbutton.propTypes = {
  updateLoggedIn: PropTypes.func.isRequired,
  redirectUser: PropTypes.func.isRequired,
};
