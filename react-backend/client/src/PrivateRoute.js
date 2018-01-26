import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ auth, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      (auth ? (
        <Component {...props} {...rest} />
      ) : (
        <Redirect
          to={{
            pathname: '/logincb',
            state: { from: props.location },
          }}
        />
      ))
    }
  />
);

export default ProtectedRoute;
