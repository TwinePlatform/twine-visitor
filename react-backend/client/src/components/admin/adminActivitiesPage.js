import React, { Component } from 'react';
import { ActivityForm, ActivityList } from './activitiesComponents/activity';
import { addActivity, generateId, removeActivity } from './activitiesLib/activityHelpers';

export class AdminActivitiesPage extends Component {
  constructor() {
    super();
    this.state = {
      activities: [],
      currentActivity: '',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEmptySubmit = this.handleEmptySubmit.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
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

  handleRemove = (id, event) => {
    event.preventDefault();
    const updatedActivities = removeActivity(this.state.activities, id);
    this.setState({ activities: updatedActivities });
    fetch('/removeActivity', {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(id),
    });
  };

  handleSubmit(event) {
    event.preventDefault();
    const newId = generateId();
    const newActivity = { id: newId, name: this.state.currentActivity };
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
    });
  }

  handleEmptySubmit(event) {
    event.preventDefault();
    this.setState({
      errorMessage: 'Please supply an activity name',
    });
  }

  handleInputChange(event) {
    this.setState({
      currentActivity: event.target.value,
    });
  }

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
          <ActivityList activities={this.state.activities} handleRemove={this.handleRemove} />
        </div>
      </div>
    );
  }
}
