import {
  fireEvent,
  cleanup,
  waitForElement,
  wait,
} from 'react-testing-library';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import renderWithRouter from '../../../tests';
import Login from '../Login';


describe('Login Component', () => {
  afterEach(cleanup);

  test(':: incorrect user details returns 401 and displays error message', async () => {
    const mock = new MockAdapter(axios);
    mock.onPost('/api/cb/login')
      .reply(401, { result: null, error: 'Credentials not recognised' });

    const { getByText, getByLabelText } = renderWithRouter({ setLoggedIn: () => { } })(Login);
    const email = getByLabelText('Email');
    const password = getByLabelText('Password');
    const submit = getByText('LOGIN');
    email.value = '123@hi.com';
    password.value = 'lolLOL123';
    fireEvent.change(email);
    fireEvent.change(password);
    fireEvent.click(submit);

    const error = await waitForElement(() => getByText('Credentials', { exact: false }));
    expect(error.textContent).toEqual('Credentials not recognised');
  });

  test(':: correct user details returns 200 and redirects to homepage', async () => {
    const mock = new MockAdapter(axios);
    mock.onPost('/api/cb/login')
      .reply(200, {});

    const { getByText, history, getByLabelText } =
      renderWithRouter({ setLoggedIn: () => { }, route: '/cb/login' })(Login);

    const email = getByLabelText('Email');
    const password = getByLabelText('Password');
    const submit = getByText('LOGIN');
    email.value = 'findmyfroggy@frogfinders.com';
    password.value = 'Funnyfingers11!';
    fireEvent.change(email);
    fireEvent.change(password);
    fireEvent.click(submit);

    await wait(() => {
      expect(history.location.pathname).toEqual('/');
    });
  });
});

