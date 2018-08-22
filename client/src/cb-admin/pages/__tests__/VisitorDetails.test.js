import {
  cleanup,
  waitForElement,
  wait,
} from 'react-testing-library';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import renderWithRouter from '../../../tests';
import VisitorDetails from '../VisitorDetails';


describe('VisitorDetails Component', () => {
  let mock;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(cleanup);

  test(':: succesful load displays visitor details on page', async () => {
    expect.assertions(3);

    mock.onGet('/api/users/all')
      .reply(200,
        { result: [{ full_count: '1',
          id: 4,
          name: 'yusra mardini',
          gender: 'female',
          yob: 1998,
          email: 'maemail@gmail.com',
          registered_at: '2017-05-15T12:24:52.000Z',
          email_consent: false,
          sms_consent: false }],
        meta: { full_count: 1 } });

    const { getByText } =
        renderWithRouter()(VisitorDetails);

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

    mock.onGet('/api/users/all')
      .reply(401,
        { result: null,
        });

    mock.onPost('/api/cb/details')
      .reply(401,
        { result: null,
        });

    const { history } =
      renderWithRouter()(VisitorDetails);

    await wait(() => expect(history.location.pathname).toEqual('/admin/login'));
  });
});

