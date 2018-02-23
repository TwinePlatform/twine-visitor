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
              pathname: '/logincb',
              state: { from: props.location }, // eslint-disable-line react/prop-types
            }}
          />
      )
    }
  />
);

ProtectedRoute.propTypes = {
  auth: PropTypes.bool.isRequired,
  component: PropTypes.element.isRequired,
};

export default ProtectedRoute;
