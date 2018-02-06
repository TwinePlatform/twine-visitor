import React, { Component } from 'react';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';

import {
  ActivityForm,
  ActivityList,
  ActivityEmptyList,
} from './activitiesComponents/activity';
import {
  addActivity,
  generateId,
  removeActivity,
  findById,
  updateActivity,
  updateId,
} from './activitiesLib/activityHelpers';
import { adminPost, adminGet } from './activitiesLib/admin_helpers';
import { IntroText } from './sharedComponents/IntroText';

export class AdminActivitiesPage extends Component {
  constructor() {
    super();
    this.state = {
      activities: [],
      currentActivity: '',
      deleteModal: false,
    };
  }

  handleActivityFromDb = activity => res => {
    const newActivities = updateId(this.state.activities, activity.id, res.id);
    this.setState({ activities: newActivities });
  };

  setErrorMessage = (error, errorString) => {
    // console.log(error) // Uncomment to display full errors in the console.
    this.setState({ errorMessage: errorString });
  };

  openDeleteModal = deleteModal => () => this.setState({ deleteModal });

  componentDidMount() {
    adminGet(this, '/activities/all')
      .then(({ activities }) => this.setState({ activities }))
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

  toggleDay = (day, id) => {
    const activity = findById(id, this.state.activities);
    const updatedActivity = { ...activity, [day]: !activity[day] };
    const updatedActivities = updateActivity(
      this.state.activities,
      updatedActivity
    );

    this.setState({ activities: updatedActivities });

    adminPost(this, '/activity/update', updatedActivity)
      .then(res => res)
      .catch(error => this.setErrorMessage(error, 'Error setting day'));
  };

  handleRemove = (id, event) => {
    const updatedActivities = removeActivity(this.state.activities, id);
    this.setState({ activities: updatedActivities });

    adminPost(this, '/activity/delete', { id })
      .then(res => res)
      .catch(error => this.setErrorMessage(error, 'Error removing activity'));
  };

  handleSubmit = event => {
    event.preventDefault();
    const newId = generateId();
    const newActivity = {
      id: newId,
      name: this.state.currentActivity,
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    };
    const updatedActivities = addActivity(this.state.activities, newActivity);
    this.setState({
      activities: updatedActivities,
      currentActivity: '',
      errorMessage: '',
    });

    adminPost(this, '/activity/add', { name: newActivity.name })
      .then(this.handleActivityFromDb(newActivity))
      .catch(error => {
        if (error.message === 'No admin token')
          return this.props.history.push('/admin/login');

        this.setErrorMessage(error, 'Error removing activity');
      });
  };

  handleEmptySubmit = event => {
    event.preventDefault();
    this.setState({
      errorMessage: 'Please supply an activity name',
    });
  };

  handleInputChange = event => {
    this.setState({
      currentActivity: event.target.value,
    });
  };

  render() {
    const submitHandler = this.state.currentActivity
      ? this.handleSubmit
      : this.handleEmptySubmit;
    return (
      <React.Fragment>
        <IntroText text="Use the forms on this page to add new business activities and choose
        the days activities run on." />
        <Subheader>Add a new activity</Subheader>
        <Divider />
        <ActivityForm
          handleInputChange={this.handleInputChange}
          currentActivity={this.state.currentActivity}
          handleSubmit={submitHandler}
        />
        {(this.state.activities.length && (
          <React.Fragment>
            <Subheader>Activity settings</Subheader>
            <ActivityList
              openDeleteModal={this.openDeleteModal}
              deleteModal={this.state.deleteModal}
              toggleDay={this.toggleDay}
              activities={this.state.activities}
              handleRemove={this.handleRemove}
            />
          </React.Fragment>
        )) || <ActivityEmptyList />}
      </React.Fragment>
    );
  }
}
