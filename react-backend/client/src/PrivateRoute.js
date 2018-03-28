import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ auth, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      (
        auth
          ? <Component {...props} {...rest} />
          : <Redirect
            to={{
              pathname: '/cb/login',
              state: { from: props.location }, // eslint-disable-line react/prop-types
            }}
          />
      )
    }
  />
);

ProtectedRoute.propTypes = {
  auth: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
};

ProtectedRoute.defaultProps = {
  auth: false,
};

export default ProtectedRoute;
