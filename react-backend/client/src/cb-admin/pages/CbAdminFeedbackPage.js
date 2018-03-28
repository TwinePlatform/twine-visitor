import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import styled from 'styled-components';
import { CbAdmin } from '../../api';
import { PrimaryButton } from '../../shared/components/form/base';
import { FlexContainerRow } from '../../shared/components/layout/base';
import { Heading, Link, Paragraph } from '../../shared/components/text/base';
import { colors } from '../../shared/style_guide';
import '../../DatePicker.css';

const FeedbackPrimaryButton = PrimaryButton.extend`
  width: auto;
  margin: 0px 1rem;
  padding: 0.5rem;
`;

const FeedbackParagraph = Paragraph.extend`
  display: inline-block;
`;

const SpaceBetweenFlexContainerRow = FlexContainerRow.extend`
  justify-content: space-between;
  margin-top: 1rem;
`;

const InvisibleDiv = styled.div`
visibility: ${props => (props.visible ? 'visible' : 'hidden')}
`;

const feedbackColors = [
  {
    feedback_score: -1,
    label: 'Unsatisfied',
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
    label: 'Satisfied',
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

const logout = props => () => {
  localStorage.removeItem('token');
  props.updateLoggedIn();
};

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
    return (
      <div>
        <SpaceBetweenFlexContainerRow>
          <Link to="/" onClick={this.removeAdmin}>
          Back to the main page
          </Link>
          <Link to="/logincb" onClick={logout(this.props)}> Logout </Link>
        </SpaceBetweenFlexContainerRow>

        <Heading>Visitor Satisfaction</Heading>
        <div>
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
        <InvisibleDiv visible={this.state.showDatePicker} >
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
        </InvisibleDiv>

        {this.state.data
          ? <Doughnut data={donutConfig(feedbackColors, this.state.data.result)} />
          : <h2>{this.state.error}.</h2> }
      </div>
    );
  }
}

CbAdminFeedbackPage.propTypes = {
  auth: PropTypes.string.isRequired,
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
