import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import { PrimaryButtonNoFill, PrimaryButton } from '../../shared/components/form/base';
import { Heading, Link, Paragraph } from '../../shared/components/text/base';
import { colors } from '../../shared/style_guide';
import '../../DatePicker.css';
import Logoutbutton from '../../components/visitors/logoutbutton';
import { CbAdmin } from '../../api';

const FeedbackPrimaryButton = PrimaryButton.extend`
  width: auto;
  margin: 0px 10px
`;

const FeedbackPrimaryButtonNoFill = PrimaryButtonNoFill.extend`
  width: auto;
  display: block;
`;

const FeedbackParagraph = Paragraph.extend`
  display: inline-block;
`;

const feedbackColors = [
  {
    feedback_score: -1,
    label: 'Unimpressed',
    backgroundColor: colors.highlight_secondary,
    hoverBackgroundColor: colors.hover_secondary,
  },
  {
    feedback_score: 0,
    label: 'Neutral',
    backgroundColor: colors.light,
    hoverBackgroundColor: colors.dark,
  },
  {
    feedback_score: 1,
    label: 'Impressed',
    backgroundColor: colors.highlight_primary,
    hoverBackgroundColor: colors.hover_primary,
  },
];

const donutConfig = (colorConfig, feedbackCountArray) =>
  ({
    labels: feedbackColors.map(el => el.label),
    datasets: [
      {
        data: feedbackColors.map(
          el => feedbackCountArray.filter(feedbackCount =>
            feedbackCount.feedback_score === el.feedback_score)[0].count,
        ),
        backgroundColor: feedbackColors.map(el => el.backgroundColor),
        hoverBackgroundColor: feedbackColors.map(el => el.hoverBackgroundColor),
      },
    ],
  });

const lastCallStates = {
  ALL: 'ALL',
  DATERANGEPICKER: 'DATERANGEPICKER',
};

export default class CbAdminFeedbackPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      error: null,
      startDate: null,
      endDate: null,
      focusedInput: null,
      lastCall: null,
      showDatePicker: false,
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

    if (prevState.lastCall === lastCallStates.DATERANGEPICKER
        && this.state.lastCall === lastCallStates.ALL) {
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
        console.log(err.response);
        if (err.response.status === 401) {
          this.props.history.push('/admin/login');
        }
        this.setState({ error: 'Sorry there has been an error with your request' });
      });
  }

  handleAllDates = () => {
    this.setState({
      startDate: null,
      endDate: null,
      lastCall: lastCallStates.ALL,
    });
  }

  render() {
    const visibility = this.state.showDatePicker ? 'visible' : 'hidden';
    return (
      <div>
        <Link to="/" onClick={this.removeAdmin}>
          <FeedbackPrimaryButtonNoFill>Back to the main page</FeedbackPrimaryButtonNoFill>
        </Link>
        <Logoutbutton
          updateLoggedIn={this.props.updateLoggedIn}
          redirectUser={this.props.history.push}
        />
        <Heading>Visitor Satisfaction</Heading>

        <div className="daterange-container">
          <div className="daterange-view-option">
            <FeedbackParagraph displayInline>View:</FeedbackParagraph>
            <FeedbackPrimaryButton onClick={this.handleAllDates}>
              All dates
            </FeedbackPrimaryButton>
            <FeedbackPrimaryButton
              onClick={() =>
                this.setState({ showDatePicker: !this.state.showDatePicker })}
            >
              Dates between...
            </FeedbackPrimaryButton>
          </div>

          <div style={{ visibility }} className="daterange-picker">
            <DateRangePicker
              startDate={this.state.startDate}
              startDateId="start_date_id"
              endDate={this.state.endDate}
              endDateId="end_date_id"
              onDatesChange={
                ({ startDate, endDate }) =>
                  this.setState({ startDate, endDate, lastCall: lastCallStates.DATERANGEPICKER })
              }
              focusedInput={this.state.focusedInput}
              onFocusChange={focusedInput => this.setState({ focusedInput })}
            />
          </div>
        </div>

        {this.state.data
          ? <Doughnut data={donutConfig(feedbackColors, this.state.data.result)} />
          : <h2>{this.state.error}.</h2> }
      </div>
    );
  }
}

CbAdminFeedbackPage.propTypes = {
  auth: PropTypes.string.isRequired,
  updateLoggedIn: PropTypes.func.isRequired,
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
