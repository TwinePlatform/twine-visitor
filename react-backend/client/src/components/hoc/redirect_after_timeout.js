import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

const redirectAfterTimeout = (url, ms) => (Child) => {
  class RedirectAfterTimeout extends Component {
    componentDidMount() {
      this.timer = setTimeout(() => this.props.history.push(url), ms);
    }

    componentWillUnmount() {
      clearTimeout(this.timer);
    }

    render() {
      return <Child {...this.props} />;
    }
  }

  RedirectAfterTimeout.propTypes = {
    history: PropTypes.shape({ push: PropTypes.func }).isRequired,
  };

  return withRouter(RedirectAfterTimeout);
};

export default redirectAfterTimeout;
