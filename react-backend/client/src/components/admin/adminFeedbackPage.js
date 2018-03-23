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

const donofig = (colorConfig, data) =>
  ({
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
  })
;
const lastCallStates = {
  ALL: 'ALL',
  DATERANGEPICKER: 'DATERANGEPICKER',
};
export default class AdminFeedbackPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      error: null,
      startDate: null,
      endDate: null,
      focusedInput: null,
      lastCall: null,
    };
  }
  componentDidMount() {
    this.handleGetFeedback();
  }

  componentDidUpdate(prevProps, prevState) {

    if (
      prevState.focusedInput !== this.state.focusedInput
      && !this.state.focusedInput
      && this.state.startDate
      && this.state.endDate) {
      this.handleGetFeedback();
    }

    if (
      prevState.lastCall === lastCallStates.DATERANGEPICKER
      && this.state.lastCall === lastCallStates.ALL
    ) {
      this.handleGetFeedback();
    }
  }

  handleGetFeedback= () => {
    CbAdmin.getFeedback(this.props.auth, this.state.startDate, this.state.endDate)
      .then(({ data }) => {
        data.result[0] //eslint-disable-line
          ? this.setState({ data, error: null })
          : this.setState({ error: 'Sorry, no data was found', data: null });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ error: 'Sorry there has been an error with your request' });
      });
  }
  handleClearDates = () => {
    this.setState({
      startDate: null,
      endDate: null,
      lastCall: lastCallStates.ALL,
    });

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
            <PrimaryButton onClick={this.handleClearDates}>
              <h3>All</h3>
            </PrimaryButton>
            <PrimaryButton>
              <h3>Dates between...</h3>
            </PrimaryButton>
          </div>

          <div className="daterange-picker">
            <DateRangePicker
              startDate={this.state.startDate}
              startDateId="your_unique_start_date_id"
              endDate={this.state.endDate}
              endDateId="your_unique_end_date_id"
              onDatesChange={({ startDate, endDate }) => this.setState(
                { startDate,
                  endDate,
                  lastCall: lastCallStates.DATERANGEPICKER })
              }
              focusedInput={this.state.focusedInput}
              onFocusChange={focusedInput => this.setState({ focusedInput })}
            />
          </div>
        </div>

        {this.state.data ?
          <Doughnut data={donofig(feedbackColors, this.state.data.result)} />
          : <h2>{this.state.error}.</h2> }
      </div>
    );
  }
}

AdminFeedbackPage.propTypes = {
  auth: PropTypes.string.isRequired,
  updateLoggedIn: PropTypes.func.isRequired,
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
