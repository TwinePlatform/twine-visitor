import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PrimaryButtonNoFill } from '../../shared/components/form/base';

const LogoutPrimaryButtonNoFill = PrimaryButtonNoFill.extend`
  width: auto;
`;

export default class Logoutbutton extends Component {
  logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    this.props.updateLoggedIn();
    this.props.redirectUser('/logincb');
  };

  render() {
    return (
      <LogoutPrimaryButtonNoFill type="submit" onClick={this.logout}>
        Log out
      </LogoutPrimaryButtonNoFill>
    );
  }
}

Logoutbutton.propTypes = {
  updateLoggedIn: PropTypes.func.isRequired,
  redirectUser: PropTypes.func.isRequired,
};
