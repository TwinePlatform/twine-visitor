import {
  cleanup,
  waitForElement,
  wait,
} from 'react-testing-library';
import MockAdapter from 'axios-mock-adapter';
import { axios } from '../../../api';
import { renderWithRouter } from '../../../tests';
import VisitorDetails from '../VisitorDetails';


describe('VisitorDetails Component', () => {
  let mock;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(cleanup);

  test(':: succesful load displays visitor details on page', async () => {
    expect.assertions(3);

    mock.onPut('/community-businesses/me', {
      name: undefined,
      sector: undefined,
      region: undefined,
      logoUrl: undefined,
    })
      .reply(200, { result: null });

    mock
      .onGet('/genders')
      .reply(200, { result: [{ id: 1, name: 'male' }, { id: 2, name: 'female' }, { id: 3, name: 'prefer not to say' }] });

    mock.onGet('/community-businesses/me/visitors', { params: { offset: 0, limit: 10 } })
      .reply(200,
        { result: [{
          id: 4,
          name: 'yusra mardini',
          gender: 'female',
          yob: 1998,
          email: 'maemail@gmail.com',
          registered_at: '2017-05-15T12:24:52.000Z',
          email_consent: false,
          sms_consent: false }],
        meta: { total: 1 } });

    const { getByText } = renderWithRouter()(VisitorDetails);

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

    mock.onPut('/community-businesses/me')
      .reply(200, { result: null });

    mock.onGet('/genders')
      .reply(200, { result: [{ id: 1, name: 'male' }, { id: 2, name: 'female' }, { id: 3, name: 'prefer not to say' }] });

    mock.onGet('/community-businesses/me/visitors', { params: { offset: 0, limit: 10 } })
      .reply(401, { result: null });

    const { history } = renderWithRouter()(VisitorDetails);

    await wait(() => expect(history.location.pathname).toEqual('/cb/confirm'));
  });
});

