import React from 'react';
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

export default AdminRoute;
