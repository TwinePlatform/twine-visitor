import React, { Component } from 'react';
import PropTypes from 'prop-types';

const requestStates = {
  SUCCESS: 'SUCCESS',
  PENDING: 'PENDING',
};
const adminLoginCheck = (Child) => {
  class AdminLoginCheck extends Component {
    constructor(props) {
      super(props);
      this.state = {
        auth: requestStates.PENDING,
        errorMessage: '',
      };
    }

    componentDidMount() {
      const adminToken = this.props.auth;
      if (!adminToken) throw new Error('No admin token');

      const headers = {
        Authorization: adminToken,
        'Content-Type': 'application/json',
      };
      const opts = { headers, method: 'post' };

      new Promise((resolve, reject) => {
        this.cancelRequest = () => {
          reject(new Error('REQUEST_CANCELLED'));
        };
        fetch('/api/admin/check', opts)
          .then(resolve)
          .catch(reject);
      })
        .then(() => this.setState({ auth: requestStates.SUCCESS }))
        .catch((error) => {
          if (error.message === 'REQUEST_CANCELLED') return;

          if (error.message === 500) {
            this.props.history.push('/error/500');
          } else if (error.message === 'No admin token') {
            this.props.history.push('/admin/login');
          } else {
            this.props.history.push('/admin/login');
          }
        });
    }
    componentWillUnmount() {
      this.cancelRequest();
    }

    removeAdmin = () => {
      localStorage.removeItem('adminToken');
    };

    render() {
      return this.state.auth === requestStates.SUCCESS ? (
        <Child removeAdmin={this.removeAdmin} {...this.props} />
      ) : (
          <div> CHECKING ADMIN... </div>
        );
    }
  }

  AdminLoginCheck.propTypes = {
    auth: PropTypes.string.isRequired,
    updateLoggedIn: PropTypes.func.isRequired,
    history: PropTypes.shape({ push: PropTypes.func }).isRequired,
  };
  return AdminLoginCheck;
};

export default adminLoginCheck;
