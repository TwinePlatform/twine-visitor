import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class HomeVisitor extends Component {
  render() {
    return (
      <div>
        <h1>
          Welcome visitor! <br /> What do you want to do?<br />
        </h1>
        <Link to="/visitor/signup">
          <button className="Button">Sign up</button>
        </Link>
        <br />
        <Link to="/visitor/login">
          <button className="Button">Login</button>
        </Link>
        <br />
        <Link to="/">
          <button className="Button ButtonBack">Back to the main page</button>
        </Link>
        <br />

        <a
          href="http://www.powertochange.org.uk/data-protection-funding-applications/"
          className="Policy"
        >
          Data Protection Policy
        </a>
      </div>
    );
  }
}
