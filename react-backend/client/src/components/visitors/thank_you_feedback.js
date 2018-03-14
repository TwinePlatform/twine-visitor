import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

export default class ThankYouFeedback extends Component {
  componentDidMount() {
    this.timer = setTimeout(() => this.props.history.push('/visitor'), 5000);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    return (
      <div>
        <h1>
          Thank you for your feedback<br />
        </h1>

        <br />
        <h2>See you soon!</h2>
      </div>
    );
  }
}

ThankYouFeedback.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};

withRouter(ThankYouFeedback);
