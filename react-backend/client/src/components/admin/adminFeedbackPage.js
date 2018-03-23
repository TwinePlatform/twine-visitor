import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker } from 'react-dates';
import { PrimaryButtonNoFill, PrimaryButton } from '../../shared/components/form/base';
import { Heading, Link } from '../../shared/components/text/base';

import Logoutbutton from '../visitors/logoutbutton';
import { CbAdmin } from '../../api';

const feedbackColors = [
  {
    feedback_score: -1,
    label: 'Unimpressed',
    backgroundColor: '#833FF7',
    hoverBackgroundColor: '#6717F3',
  },
  {
    feedback_score: 0,
    label: 'Neutral',
    backgroundColor: '#DBDBDB',
    hoverBackgroundColor: '#666666',
  },
  {
    feedback_score: 1,
    label: 'Impressed',
    backgroundColor: '#FDBD2D',
    hoverBackgroundColor: '#DE9B06',
  },
];

const donofig = (colorConfig, data) => ({
  labels: feedbackColors.map(el => el.label),
  datasets: [
    {
      data: feedbackColors.map(
        el => data.filter(dat => dat.feedback_score === el.feedback_score)[0].count,
      ),
      backgroundColor: feedbackColors.map(el => el.backgroundColor),
      hoverBackgroundColor: feedbackColors.map(el => el.hoverBackgroundColor),
    },
  ],
});

export default class AdminFeedbackPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      error: null,
      startDate: null,
      endDate: null,
      focusedInput: null,
    };
  }
  componentDidMount() {
    CbAdmin.getFeedback(this.props.auth)
      .then(({ data }) => this.setState({ data }))
      .catch(err => this.setState(err));
  }

  render() {
    return (
      <div>
        <Link to="/" onClick={this.removeAdmin}>
          <PrimaryButtonNoFill>Back to the main page</PrimaryButtonNoFill>
        </Link>
        <Logoutbutton
          updateLoggedIn={this.props.updateLoggedIn}
          redirectUser={this.props.history.push}
        />
        <Heading>Visitor Satisfaction</Heading>

        <div className="daterange-container">
          <div className="daterange-view-option">
            <h3>View:</h3>
            <PrimaryButton>
              <h3>All</h3>
            </PrimaryButton>
            <PrimaryButton>
              <h3>Dates between...</h3>
            </PrimaryButton>
          </div>

          <div className="daterange-picker">
            <DateRangePicker
              startDate={this.state.startDate} // momentPropTypes.momentObj or null,
              startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
              endDate={this.state.endDate} // momentPropTypes.momentObj or null,
              endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
              onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })} // PropTypes.func.isRequired,
              focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
              onFocusChange={focusedInput => this.setState({ focusedInput })}
            />
          </div>
        </div>

        {this.state.data && <Doughnut data={donofig(feedbackColors, this.state.data.result)} />}
        {this.state.error && <h2>Sorry there has been an error with your request.</h2>}
      </div>
    );
  }
}

AdminFeedbackPage.propTypes = {
  updateLoggedIn: PropTypes.func.isRequired,
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
