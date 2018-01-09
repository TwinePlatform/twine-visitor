import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ActivityForm, ActivityList } from './activitiesComponents/activity';
import {
  addActivity,
  generateId,
  removeActivity,
  findById,
  updateActivity,
} from './activitiesLib/activityHelpers';

export class AdminActivitiesPage extends Component {
  constructor() {
    super();
    this.state = {
      activities: [],
      currentActivity: '',
    };
  }

  headers = new Headers({
    Authorization: localStorage.getItem('token'),
  });

  componentDidMount() {
    fetch('/activities', {
      method: 'GET',
      headers: this.headers,
    })
      .then(res => {
        if (res.status === 500) {
          throw new Error();
        } else {
          return res.json();
        }
      })
      .then(res => res.activities)
      .then(activities => {
        this.setState({ activities });
      })
      .catch(error => {
        console.log('error with fetching activities');
        this.props.history.push('/admin');
      });
  }

  toggleDay = (day, id) => {
    const activity = findById(id, this.state.activities);
    const updatedActivity = { ...activity, [day]: !activity[day] };
    const updatedActivities = updateActivity(this.state.activities, updatedActivity);
    console.log(updatedActivities);
    this.setState({ activities: updatedActivities });
    fetch('/updateActivityDay', {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(updatedActivity),
    })
      .then(res => {
        if (res.status === 500) {
          throw new Error();
        }
      })
      .catch(error => {
        console.log('error with toggleDay');
        this.props.history.push('/admin');
      });
  };

  handleRemove = (id, event) => {
    event.preventDefault();
    const updatedActivities = removeActivity(this.state.activities, id);
    this.setState({ activities: updatedActivities });
    fetch('/removeActivity', {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(id),
    })
      .then(res => {
        if (res.status === 500) {
          throw new Error();
        }
      })
      .catch(error => {
        console.log('error with removing activities');
        this.props.history.push('/admin');
      });
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
    fetch('/addActivity', {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(newActivity),
    })
      .then(res => {
        if (res.status === 500) {
          throw new Error();
        }
      })
      .catch(error => {
        console.log('error with adding activities');
        this.props.history.push('/admin');
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
    const submitHandler = this.state.currentActivity ? this.handleSubmit : this.handleEmptySubmit;
    return (
      <div>
        <h2>Update Activities</h2>
        <div className="Activities">
          {this.state.errorMessage && <span className="ErrorText">{this.state.errorMessage}</span>}
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
