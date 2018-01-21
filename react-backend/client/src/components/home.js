import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class Home extends Component {
  render() {
    return (
      <div>
        <h1>
          Who are you?<br />
        </h1>
        <Link to="/visitor">
          <button className="Button">Visitor</button>
        </Link>
        <br />
        <Link to="/admin/login">
          <button className="Button">Admin</button>
        </Link>
        <br />
      </div>
    );
  }
}
