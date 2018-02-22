import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

export class Thanks extends Component {
  componentDidMount() {
    // Start counting when the page is loaded
    this.timeoutHandle = setTimeout(() => {
      this.props.history.push('/visitor');
    }, 5000);
  }

  render() {
    return (
      <section>
        <h1>Thank-you for joining us today</h1>
        <h2>Enjoy your visit!</h2>
      </section>
    );
  }
}

Thanks.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};

withRouter(Thanks);
