import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { BeatLoader as Bl } from 'react-spinners';
import styled from 'styled-components';

import { colors } from '../shared/style_guide';
import { Roles } from '../api';

const status = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
};

const BeatLoader = styled(Bl)`
  width: 60px;
  margin: 0 auto;
  padding-top: 5rem;
`;

export default class PrivateCookieRoute extends React.Component {

  state = {
    authCheck: status.PENDING,
  }

  componentDidMount() {
    Roles.check()
      .then(() => this.setState({ authCheck: status.SUCCESS }))
      .catch(() => this.setState({ authCheck: status.FAILURE }));
  }

  render() {
    const { component: Component, ...rest } = this.props;

    switch (this.state.authCheck) {
      case status.PENDING:
        return (
          <BeatLoader
            color={colors.highlight_primary}
            sizeUnit={'px'}
            size={15}
          />
        );

      case status.SUCCESS:
        return (
          <Route {...rest} render={props => (<Component {...props} />)} />
        );

      case status.FAILURE:
      default: // cos js be whack
        return (
          <Redirect to={{ pathname: '/login' }} />
        );
    }

  }
}
