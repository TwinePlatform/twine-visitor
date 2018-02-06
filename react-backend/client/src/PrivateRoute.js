import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import MainAppBar from './components/sharedComponents/MainAppBar';

const ProtectedRoute = ({ auth, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      (auth ? (
        <React.Fragment>
          <MainAppBar {...rest} />
          <Component {...props} {...rest} />
        </React.Fragment>
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
