import React from 'react';
import {
  fireEvent,
  cleanup,
  waitForElement,
  wait,
} from 'react-testing-library';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { renderWithRouter } from '../../../tests'
import Login from '../Login';


describe('Login Component', () => {
  afterEach(cleanup);

  test(':: error response details displays error message', async () => {
    var mock = new MockAdapter(axios);
    mock.onPost('/api/cb/login')
      .reply(401, { "result": null, "error": "Credentials not recognised" });

    const { getByText } = renderWithRouter({ setLoggedIn: () => { } })(Login);
    const submit = getByText('LOGIN');
    fireEvent.click(submit);

    const error = await waitForElement(() => {
      return getByText("Credentials", { exact: false })
    });
    expect(error.textContent).toEqual('Credentials not recognised')
  });

  test(':: correct response redirects to homepage', async () => {
    var mock = new MockAdapter(axios);
    mock.onPost('/api/cb/login')
      .reply(200, {});

    const { getByText, history } =
      renderWithRouter({ setLoggedIn: () => { }, route: '/cb/login' })(Login);

    const submit = getByText('LOGIN');
    fireEvent.click(submit);

    await wait(() => {
      expect(history.location.pathname).toEqual('/');
    });
  });
});

