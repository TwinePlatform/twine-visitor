import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class QrError extends Component {
  render() {
    return (
      <section className="Main">
        <h1>We’re sorry, there was a problem scanning your code</h1>
        <h2>Please choose one of these options or go to Reception for help</h2>
        <Link to="/visitor/signup">
          <button className="Button">Register as a new user</button>
        </Link>
        <br />
        <Link to="/visitor/login">
          <button className="Button">Try to scan QR code again</button>
        </Link>
        <br />
      </section>
    );
  }
}
