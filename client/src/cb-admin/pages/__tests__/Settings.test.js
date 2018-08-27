import {
  cleanup,
  waitForElement,
  wait,
} from 'react-testing-library';
import MockAdapter from 'axios-mock-adapter';
import renderWithRouter from '../../../tests';
import Settings from '../Settings';
import { axios } from '../../../api';

describe('Settings Component', () => {
  let mock;
  const API_HOST = 'http://localhost:4000';

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(cleanup);

  test(':: succesful load displays cbs details on page', async () => {
    expect.assertions(3);

    mock.onGet(`${API_HOST}/v1/community-businesses/me`)
      .reply(200,
        { result: {
          id: 3,
          name: 'Frog Finders',
          sector: 'Environment or nature',
          email: 'findmyfroggy@frogfinders.com', // currently not returned in response
          logoUrl: null,
          date: '2017-05-15T12:24:56.000Z' },
        });

    const { getByText } = renderWithRouter()(Settings);
    const [title, cbType, email] = await waitForElement(() => [
      getByText('Frog Finders'),
      getByText('Environment or nature'),
      getByText('findmyfroggy@frogfinders.com'),

    ]);
    expect(title.textContent).toEqual('Frog Finders');
    expect(cbType.textContent).toEqual('Environment or nature');
    expect(email.textContent).toEqual('findmyfroggy@frogfinders.com');
  });

  test(':: unauthorised request redirects to ', async () => {
    expect.assertions(1);

    mock.onGet(`${API_HOST}/v1/community-businesses/me`)
      .reply(401,
        { result: null,
        });

    const { history } = renderWithRouter()(Settings);

    await wait(() => expect(history.location.pathname).toEqual('/admin/login'));
  });
});
