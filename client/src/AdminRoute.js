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
  auth: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
  location: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

AdminRoute.defaultProps = {
  location: '',
};

export default AdminRoute;
