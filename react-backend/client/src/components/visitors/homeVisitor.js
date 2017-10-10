import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class HomeVisitor extends Component {
  render() {
    return (
      <div>
        Where do you want to go?<br />
        <Link to="/visitor/signup">Sign up</Link><br />
        <Link to="/visitor/login">Login</Link><br />
      </div>
    );
  }
}
