import {
  fireEvent,
  cleanup,
  waitForElement,
  wait,
} from 'react-testing-library';
import MockAdapter from 'axios-mock-adapter';
import { axios } from '../../../api';
import renderWithRouter from '../../../tests';
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
        result: null,
        error: { isJoi: true, name: 'ValidationError' },
        validation: { passwordConfirm: ['must match password'] },
      });

    const { getByText, getByLabelText } =
        renderWithRouter({
          route: '/cb/password/reset/tickettonarnia',
          match: { params: { token: 'tickettonarnia' } },
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

  test(':: matching passwords returns 200 and redirect', async () => {
    expect.assertions(2);

    mock.onPost('/users/password/reset')
      .reply(200, {
        result: null,
      });

    const { getByText, getByLabelText, history } =
        renderWithRouter({
          route: '/cb/password/reset/tickettonarnia',
          match: { params: { token: 'tickettonarnia' } },
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
      expect(history.location.pathname).toEqual('/cb/login');
      expect(history.location.search).toEqual('?ref=pwd_reset');
    });
  });
});
