import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

export class Logoutbutton extends Component {
  logout = () => {
    localStorage.removeItem('token');
    this.props.updateLoggedIn();
  };

  render() {
    return <RaisedButton label="Log out" onClick={this.logout} />;
  }
}
