import {
  fireEvent,
  cleanup,
  waitForElement,
  wait,
} from 'react-testing-library';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import renderWithRouter from '../../../tests';
import ForgotPassword from '../ForgotPassword';


describe('Login Component', () => {
  let mock;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(cleanup);

  test(':: subscribed email sends 200 and redirects to login', async () => {
    expect.assertions(1);

    mock.onPost('/api/cb/pwd/reset')
      .reply(200, { result: null });

    const { getByText, getByLabelText, history } =
      renderWithRouter()(ForgotPassword);

    const email = getByLabelText('Email');
    const submit = getByText('CONTINUE');

    email.value = 'frogfindmyfroggy@frogfinders.com';
    fireEvent.change(email);
    fireEvent.click(submit);

    await wait(() => history.length === 2);
    expect(history.location.pathname).toEqual('/cb/login');
  });

  test(':: unsubscribed email sends 401 and displays error message', async () => {
    expect.assertions(1);

    mock.onPost('/api/cb/pwd/reset')
      .reply(401, { result: null, error: 'Email not recognised' });

    const { getByText, getByLabelText } = renderWithRouter()(ForgotPassword);

    const email = getByLabelText('Email');
    const submit = getByText('CONTINUE');

    email.value = 'notreal@frogfinders.com';
    fireEvent.change(email);
    fireEvent.click(submit);

    const error = await waitForElement(() => getByText('Email not recognised'));
    expect(error.textContent).toEqual('Email not recognised');
  });


});

