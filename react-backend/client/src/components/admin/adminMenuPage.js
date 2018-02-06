import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

import { checkAdmin } from './activitiesLib/admin_helpers';

export class AdminMenuPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
    };
  }

  componentDidMount() {
    checkAdmin(this)
      .then(() => null)
      .catch(error => null);
  }

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  removeAdmin = () => {
    localStorage.removeItem('adminToken');
  };

  render() {
    return (
      <React.Fragment>
        <List style={{ textAlign: 'left' }}>
          <Subheader>Admin Settings</Subheader>
          <Link to="/admin/activities" style={{ textDecoration: 'none' }}>
            <ListItem
              primaryText="Activities"
              secondaryText="Edit your community business activities"
            />
          </Link>
          <Link to="/admin/visits" style={{ textDecoration: 'none' }}>
            <ListItem
              primaryText="Visits"
              secondaryText="View information about visitors"
            />
          </Link>
          <Link to="/admin/users" style={{ textDecoration: 'none' }}>
            <ListItem
              primaryText="Users"
              secondaryText="Edit user information and re-email or print user QR codes"
            />
          </Link>
          <Link to="/admin/accountSettings" style={{ textDecoration: 'none' }}>
            <ListItem
              primaryText="Account Settings"
              secondaryText="Change your community business information and add a logo"
            />
          </Link>
        </List>
      </React.Fragment>
    );
  }
}
