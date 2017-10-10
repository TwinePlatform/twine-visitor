import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class Home extends Component {
  render() {
    return (
      <div>
        Who are you?<br />
        <Link to="/visitor">Visitor</Link><br />
        <Link to="/admin">Admin</Link><br />
      </div>
    );
  }
}
