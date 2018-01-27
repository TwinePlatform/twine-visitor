import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../visitors/button';
import { Logoutbutton } from '../visitors/logoutbutton';
import { checkAdmin } from './activitiesLib/admin_helpers';

export class AdminMenuPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: 'PENDING',
      errorMessage: '',
    };
  }

  componentDidMount() {
    checkAdmin(this)
      .then(() => this.setState({ auth: 'SUCCESS' }))
      .catch(error => {
        if (error.message === 500) {
          this.props.history.push('/internalServerError');
        } else if (error.message === 'No admin token') {
          this.props.history.push('/admin/login');
        } else {
          this.props.history.push('/admin/login');
        }
      });
  }

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  removeAdmin = () => {
    localStorage.removeItem('adminToken');
  };

  render() {
    return this.state.auth === 'SUCCESS' ? (
      <div>
        <h1>
          Welcome admin! <br /> Where do you want to go?<br />
        </h1>
        <Link to="/admin/activities">
          <button className="Button">Activities</button>
        </Link>
        <br />
        <Link to="/admin/visits">
          <button className="Button">Visits</button>
        </Link>
        <br />
        <Link to="/admin/users">
          <button className="Button">Users</button>
        </Link>
        <br />
        <Link to="/admin/accountSettings">
          <button className="Button">Account Settings</button>
        </Link>
        <br />
        <Link to="/" onClick={this.removeAdmin}>
          <button className="Button ButtonBack">Back to the main page</button>
        </Link>
        <br />
        <Logoutbutton
          updateLoggedIn={this.props.updateLoggedIn}
          redirectUser={this.props.history.push}
        />
        <br />
      </div>
    ) : (
      <div> CHECKING ADMIN... </div>
    );
  }
}
