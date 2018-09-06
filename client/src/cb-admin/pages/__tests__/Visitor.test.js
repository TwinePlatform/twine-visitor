import {
  cleanup,
  waitForElement,
  wait,
} from 'react-testing-library';
import MockAdapter from 'axios-mock-adapter';
import { axios } from '../../../api';
import renderWithRouter from '../../../tests';
import Visitor from '../Visitor';


describe('Visitor Component', () => {
  let mock;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(cleanup);

  test(':: succesful load displays visitor details on page', async () => {
    expect.assertions(3);

    mock.onGet('/community-businesses/me/visitors/4')
      .reply(200,
        { result: {
          qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgEQVR4AewaftIAAAzUSU==',
          id: 4,
          cb_id: 3,
          name: 'yusra mardini',
          gender: 'female',
          yob: 1998,
          email: 'maemail@gmail.com',
          phone_number: '7835110026',
          registered_at: '2017-05-15T12:24:52.000Z',
          email_consent: false,
          sms_consent: false } });

    mock.onGet('/community-businesses/me')
      .reply(200,
        { result: {
          id: 3,
          org_name: 'Frog Finders',
          genre: 'Environment or nature',
          uploadedfilecloudinaryurl: null,
          date: '2017-05-15T12:24:56.000Z' } });

    mock.onGet('/users/me')
      .reply(200, { email: 'findmyfroggy@frogfinders.com' });

    const { getByText } =
        renderWithRouter({
          match: { isExact: true, params: { id: '4' }, path: '/cb/visitors/:id', url: '/cb/visitors/4' },
        })(Visitor);
    const [name, gender, email] = await waitForElement(() => [
      getByText('yusra mardini'),
      getByText('female'),
      getByText('maemail@gmail.com'),
    ]);

    expect(name.textContent).toEqual('yusra mardini');
    expect(gender.textContent).toEqual('female');
    expect(email.textContent).toEqual('maemail@gmail.com');
  });

  test(':: unauthorised request redirects to login', async () => {
    expect.assertions(1);

    mock
      .onGet('/community-businesses/me/visitors/4').reply(401, { result: null })
      .onGet('/community-businesses/me').reply(401, { result: null })
      .onGet('/users/me')
      .reply(401, { result: null });

    const { history } = renderWithRouter({
      match: { isExact: true, params: { id: '4' }, path: '/cb/visitors/:id', url: '/cb/visitors/4' },
    })(Visitor);

    await wait(() => expect(history.location.pathname).toEqual('/admin/login'));
  });
});

