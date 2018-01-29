import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ActivityForm, ActivityList } from './activitiesComponents/activity';
import {
  addActivity,
  generateId,
  removeActivity,
  findById,
  updateActivity,
  updateId,
} from './activitiesLib/activityHelpers';
import { adminPost, adminGet } from './activitiesLib/admin_helpers';

export class AdminActivitiesPage extends Component {
  constructor() {
    super();
    this.state = {
      auth: 'PENDING',
      activities: [],
      currentActivity: '',
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

  componentDidMount() {
    adminGet(this, '/activities/all')
      .then(({ activities }) => this.setState({ activities, auth: 'SUCCESS' }))
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
    event.preventDefault();
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
      <div>
        <h2>Update Activities</h2>
        <div className="Activities">
          {this.state.errorMessage && (
            <span className="ErrorText">{this.state.errorMessage}</span>
          )}
          <ActivityForm
            handleInputChange={this.handleInputChange}
            currentActivity={this.state.currentActivity}
            handleSubmit={submitHandler}
          />
          <ActivityList
            toggleDay={this.toggleDay}
            activities={this.state.activities}
            handleRemove={this.handleRemove}
          />
        </div>
        <Link to="/admin">
          <button className="Button ButtonBack">Back to the Menu Page</button>
        </Link>
      </div>
    );
  }
}
