import React, { Component } from 'react';
import { ActivityForm, ActivityList } from './activitiesComponents/activity';
import { addActivity, generateId, removeActivity } from './activitiesLib/activityHelpers';

export class AdminActivitiesPage extends Component {
  constructor() {
    super();
    this.state = {
      activities: [
        { id: 1, name: 'Learn JSX' },
        { id: 2, name: 'Build an Awesome App' },
        { id: 3, name: 'Ship It' },
      ],
      currentActivity: '',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEmptySubmit = this.handleEmptySubmit.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  handleRemove = (id, event) => {
    event.preventDefault();
    const updatedActivities = removeActivity(this.state.activities, id);
    this.setState({ activities: updatedActivities });
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
