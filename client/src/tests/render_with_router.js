import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { render } from 'react-testing-library'; /*eslint-disable-line */

export default ({
  route = '/',
  history = createMemoryHistory({ initialEntries: [route] }),
  ...props
} = {}) => (Component) => {
  const componentWithRouter =
    (<Router history={history}>
      <Component history={history} {...props} />
    </Router>);
  return {
    ...render(componentWithRouter),
    // adding `history` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    history,
  };
};
