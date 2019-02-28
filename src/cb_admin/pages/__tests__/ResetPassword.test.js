import {
  fireEvent,
  cleanup,
  waitForElement,
  wait,
} from 'react-testing-library';
import MockAdapter from 'axios-mock-adapter';
import { axios } from '../../../api';
import { renderWithRouter } from '../../../tests';
import ResetPassword from '../ResetPassword';


describe('ResetPassword Component', () => {
  let mock;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(cleanup);

  test(':: non matching passwords returns 400 and displays error message', async () => {
    expect.assertions(1);

    mock.onPost('/users/password/reset')
      .reply(400, {
        error: {
          statusCode: 400,
          type: 'Bad Request',
          message: '"passwordConfirm" must match password',
          validation: { passwordConfirm: 'must match password' } } });

    const { getByText, getByLabelText } =
        renderWithRouter({
          route: '/admin/password/reset/tickettonarnia?email=lion@inthecloset.com',
          match: { params: { token: 'tickettonarnia' } },
          location: { search: '?email=lion@inthecloset.com' },
        })(ResetPassword);

    const newPassword = getByLabelText('New password');
    const confirmPassword = getByLabelText('Confirm new password');
    newPassword.value = 'lolLOL123!';
    confirmPassword.value = 'lolLOL123';

    const submit = getByText('SUBMIT');
    fireEvent.change(newPassword);
    fireEvent.change(confirmPassword);
    fireEvent.click(submit);

    const error = await waitForElement(() => getByText('match', { exact: false }));
    expect(error.textContent).toEqual('must match password');
  });

  test(':: invalid token returns 401 and displays error message', async () => {
    expect.assertions(1);

    mock.onPost('/users/password/reset')
      .reply(401, {
        error: {
          statusCode: 401,
          type: 'Unauthorized',
          message: 'Invalid token. Reset password again.',
        },
      });

    const { getByText, getByLabelText } =
        renderWithRouter({
          route: '/admin/password/reset/tickettonarnia?email=lion@inthecloset.com',
          match: { params: { token: 'tickettonarnia' } },
          location: { search: '?email=lion@inthecloset.com' },
        })(ResetPassword);

    const newPassword = getByLabelText('New password');
    const confirmPassword = getByLabelText('Confirm new password');
    newPassword.value = 'lolLOL123!';
    confirmPassword.value = 'lolLOL123!';

    const submit = getByText('SUBMIT');
    fireEvent.change(newPassword);
    fireEvent.change(confirmPassword);
    fireEvent.click(submit);

    const error = await waitForElement(() => getByText('token', { exact: false }));
    expect(error.textContent).toEqual('Invalid token. Reset password again.');
  });

  test(':: matching passwords returns 200 and redirect', async () => {
    expect.assertions(2);

    mock.onPost('/users/password/reset')
      .reply(200, {
        result: null,
      });

    const { getByText, getByLabelText, history } =
        renderWithRouter({
          route: '/admin/password/reset/tickettonarnia?email=lion@inthecloset.com',
          match: { params: { token: 'tickettonarnia' } },
          location: { search: '?email=lion@inthecloset.com' },
        })(ResetPassword);

    const newPassword = getByLabelText('New password');
    const confirmPassword = getByLabelText('Confirm new password');
    newPassword.value = 'lolLOL123!';
    confirmPassword.value = 'lolLOL123!';

    const submit = getByText('SUBMIT');
    fireEvent.change(newPassword);
    fireEvent.change(confirmPassword);
    fireEvent.click(submit);

    await wait(() => {
      expect(history.location.pathname).toEqual('/login');
      expect(history.location.search).toEqual('?ref=pwd_reset');
    });
  });
});
