import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';

import Logoutbutton from '../visitors/logoutbutton';
import { CbAdmin } from '../../api';

const donofig = data =>
  data.reduce(
    (acc, dat) => {
      acc.datasets[0].data[dat.feedback_score + 1] = dat.count;

      return acc;
    },
    {
      labels: ['Unimpressed', 'Neutral', 'Impressed'],
      datasets: [
        {
          data: [],
          backgroundColor: ['#833FF7', '#DBDBDB', '#FDBD2D'],
          hoverBackgroundColor: ['#6717F3', '#666666', '#DE9B06'],
        },
      ],
    },
  );

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
        <h1>Visitor Satisfaction</h1>
        <br />
        <div className="daterange-container">
          <div className="daterange-view-option">
            <h3>View:</h3>
            <button>
              <h3>All</h3>
            </button>
            <button>
              <h3>Dates between...</h3>
            </button>
          </div>
          <br />
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
        <br />
        {this.state.data && <Doughnut data={donofig(this.state.data.result)} />}
        {this.state.error && <h2>Sorry there has been an error with your request.</h2>}
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
    );
  }
}

AdminFeedbackPage.propTypes = {
  updateLoggedIn: PropTypes.func.isRequired,
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
