import React, { Component } from 'react';
import { Route, Redirect } from 'react-router';

export class Logoutbutton extends Component {
  logout = () => {
    localStorage.removeItem('token');
  };

  render() {
    return (
      <button className="Logoutbutton" type="submit" onClick={this.logout}>
        Log out
      </button>
    );
  }
}
