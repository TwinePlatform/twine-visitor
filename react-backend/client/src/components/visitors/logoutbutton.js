import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PrimaryButtonNoFill } from '../../shared/components/form/base';

export default class Logoutbutton extends Component {
  logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    this.props.updateLoggedIn();
    this.props.redirectUser('/logincb');
  };

  render() {
    return (
      <PrimaryButtonNoFill className="Logoutbutton" type="submit" onClick={this.logout}>
        Log out
      </PrimaryButtonNoFill>
    );
  }
}

Logoutbutton.propTypes = {
  updateLoggedIn: PropTypes.func.isRequired,
  redirectUser: PropTypes.func.isRequired,
};
