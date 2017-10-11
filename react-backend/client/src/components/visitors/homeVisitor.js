import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class HomeVisitor extends Component {
  render() {
    return (
      <div>
        <h1>Where do you want to go?<br /></h1>
        <Link to="/visitor/signup"><button className="Button">Sign up</button></Link><br />
        <Link to="/visitor/login"><button className="Button">Login</button></Link><br />
      </div>
    );
  }
}
