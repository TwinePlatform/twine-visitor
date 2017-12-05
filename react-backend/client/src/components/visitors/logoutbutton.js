import React, { Component } from 'react';

export class Logoutbutton extends Component {
  logout = () => {
    localStorage.removeItem('token');
    this.props.updateLoggedIn();
    this.props.redirectUser('/logincb');
  };

  render() {
    console.log(this.props.updateLoggedIn);
    return (
      <button className="Logoutbutton" type="submit" onClick={this.logout}>
        Log out
      </button>
    );
  }
}
