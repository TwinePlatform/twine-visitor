import {
  fireEvent,
  cleanup,
  waitForElement,
  wait,
} from 'react-testing-library';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import renderWithRouter from '../../../tests';
import Signup from '../Signup';


describe('Signup Component', () => {
  let mock;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(cleanup);

  test(':: correct cb details returns 200 and redirects', async () => {
    expect.assertions(1);

    mock.onPost('/api/cb/register')
      .reply(200, { result: null });

    const { getByText, getByLabelText, history } =
        renderWithRouter({ setLoggedIn: () => { } })(Signup);

    const businessName = getByLabelText('Business name');
    const email = getByLabelText('Contact email');
    const category = getByLabelText('Category of business');
    const region = getByLabelText('Region');
    const password = getByLabelText('Password');
    const confirmPassword = getByLabelText('Confirm Password');
    const submit = getByText('SUBMIT');

    businessName.value = 'NERV';
    email.value = 'm.katsuragi@nerv.jp';
    category.value = 'Waste reduction, reuse or recycling';
    region.value = 'South East';
    password.value = 'PenPen4eva!';
    confirmPassword.value = 'PenPen4eva!';

    fireEvent.change(businessName);
    fireEvent.change(email);
    fireEvent.change(category);
    fireEvent.change(region);
    fireEvent.change(password);
    fireEvent.change(confirmPassword);
    fireEvent.click(submit);

    await wait(() => expect(history.location.pathname).toEqual('/cb/login'));

  });

  test(':: duplicate cb details returns 409 and displays error message', async () => {
    expect.assertions(1);

    mock.onPost('/api/cb/register')
      .reply(409, { result: null, error: 'Business already registered' });

    const { getByText, getByLabelText } = renderWithRouter({ setLoggedIn: () => { } })(Signup);

    const businessName = getByLabelText('Business name');
    const email = getByLabelText('Contact email');
    const category = getByLabelText('Category of business');
    const region = getByLabelText('Region');
    const password = getByLabelText('Password');
    const confirmPassword = getByLabelText('Confirm Password');
    const submit = getByText('SUBMIT');

    businessName.value = 'NERV';
    email.value = 'm.katsuragi@nerv.jp';
    category.value = 'Waste reduction, reuse or recycling';
    region.value = 'South East';
    password.value = 'PenPen4eva!';
    confirmPassword.value = 'PenPen4eva!';

    fireEvent.change(businessName);
    fireEvent.change(email);
    fireEvent.change(category);
    fireEvent.change(region);
    fireEvent.change(password);
    fireEvent.change(confirmPassword);
    fireEvent.click(submit);

    const error = await waitForElement(() => getByText('CB using', { exact: false }));
    expect(error.textContent).toEqual('CB using this email has already been registered');
  });
});

