import React from 'react';
import MainAppBar from './components/sharedComponents/MainAppBar';
import { Route, Redirect } from 'react-router-dom';

const AdminRoute = ({ auth, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      (auth ? (
        <React.Fragment>
          <MainAppBar {...rest} />
          <Component {...props} {...rest} auth={auth} />
        </React.Fragment>
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
