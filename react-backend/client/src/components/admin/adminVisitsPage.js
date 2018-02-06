import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

import { Logoutbutton } from '../visitors/logoutbutton';
import { adminPost, adminGet } from './activitiesLib/admin_helpers';
import {
  DropdownSelect,
  DropdownMultiSelect,
} from './sharedComponents/UserInputs';
import { IntroText } from './sharedComponents/IntroText';
import { VisitsTable, EmptyVisitsTable } from './visitComponents';

export class AdminVisitsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      activities: [],
      filters: [],
      orderBy: '',
    };
  }

  setErrorMessage = (error, errorString) => {
    // console.log(error); // Uncomment to display full errors in the console.
    this.setState({ errorMessage: errorString });
  };

  componentDidMount() {
    Promise.all([
      adminGet(this, '/activities/all'),
      adminPost(this, '/visitors/all'),
    ])
      .then(([{ activities }, { users }]) => {
        const activityNames = activities.map(activity => activity.name);
        this.setState({ activities: activityNames, users });
      })
      .catch(error =>
        this.setErrorMessage(error, 'Error fetching activities and users')
      );
  }

  updateResults = () => {
    adminPost(this, '/visitors/filtered', {
      filterBy: this.state.filters,
      orderBy: this.state.orderBy,
    })
      .then(({ users }) => {
        this.setState({ users });
      })
      .catch(error => false);
  };

  sort = (e, a, sortBy) =>
    this.setState({ orderBy: sortBy }, this.updateResults);

  filter = group => (e, a, filterValue) => {
    const filterBy = group + '@' + filterValue;
    const isAdding = !this.state.filters.includes(filterBy);

    const newFilters = isAdding
      ? [...this.state.filters, filterBy]
      : this.state.filters.filter(filter => filter !== filterBy);

    this.setState({ filters: newFilters }, this.updateResults);
  };

  render() {
    const activityValues = this.state.activities.reduce((acc, activity) => {
      return { ...acc, [activity]: activity };
    }, {});

    return (
      <React.Fragment>
        <IntroText text="This page displays a log of all visits to your business." />
        <Subheader>Filter results</Subheader>
        <Divider />
        <DropdownMultiSelect
          title="Filter by Gender"
          values={{
            male: 'Male',
            female: 'Female',
            prefer_not_to_say: 'Prefer not to say',
          }}
          type="gender"
          checkedValues={this.state.filters}
          change={this.filter('gender')}
        />
        <DropdownMultiSelect
          title="Filter by Age"
          values={{
            '0-17': '0-17',
            '18-34': '18-34',
            '35-50': '35-50',
            '51-69': '51-69',
            '70-more': '70-more',
          }}
          type="age"
          checkedValues={this.state.filters}
          change={this.filter('age')}
        />
        {this.state.activities.length && (
          <DropdownMultiSelect
            title="Filter by Activity"
            values={activityValues}
            type="activity"
            checkedValues={this.state.filters}
            change={this.filter('activity')}
          />
        )}
        <Subheader>Visitors</Subheader>
        <Divider />
        <div style={{ margin: '0 auto', maxWidth: 750 }}>
          <DropdownSelect
            sort={this.sort}
            value={this.state.orderBy}
            label="Sort by"
            values={{
              name: 'Name',
              yearofbirth: 'Year of Birth',
              sex: 'Gender',
              date: 'Date of Signup',
            }}
          />
          {(this.state.users.length && (
            <VisitsTable visits={this.state.users} />
          )) || <EmptyVisitsTable />}
        </div>
        <footer style={{ height: 25 }} />
      </React.Fragment>
    );
  }
}
