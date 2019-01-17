import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import NotFound from './shared/components/NotFound';
import InternalServerError from './shared/components/InternalServerError';

import Dots from './shared/components/Dots';
import Container from './shared/components/Container';
import HomePage from './shared/pages/Home';

import VisitorRoutes from './visitors';
import CbAdminRoutes from './cb_admin';


export default class App extends Component {

  componentWillMount() {
    // avoid eslint errors to keep this a class component
  }

  render() {
    return (
      <Dots>
        <Container>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/visitor/*" component={VisitorRoutes} />
            <Route path="/cb/*" component={CbAdminRoutes} />

            <Route exact path="/error/404" component={NotFound} />
            <Route exact path="/error/:code" component={InternalServerError} />
            <Route component={NotFound} />
          </Switch>
        </Container>
      </Dots>
    );
  }
}
