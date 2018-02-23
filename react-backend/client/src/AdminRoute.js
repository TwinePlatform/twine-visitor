import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

const AdminRoute = ({ auth, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      (auth ? (
        <Component {...props} {...rest} auth={auth} />
      ) : (
        <Redirect
          to={{
            pathname: '/admin/login',
            state: { from: props.location },
          }}
        />
      ))
    }
  />
);

AdminRoute.propTypes = {
  auth: PropTypes.bool.isRequired,
  component: PropTypes.element.isRequired,
  location: PropTypes.string.isRequired,
};

export default AdminRoute;
