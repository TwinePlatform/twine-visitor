import React, { Component } from 'react';

export class Logoutbutton extends Component {
  logout = () => {
    localStorage.removeItem('token');
    this.props.updateLoggedIn();
  };

  render() {
    return (
      <button className="Logoutbutton" type="submit" onClick={this.logout}>
        Log out
      </button>
    );
  }
}
