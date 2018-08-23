import {
  cleanup,
  waitForElement,
  wait,
} from 'react-testing-library';
import MockAdapter from 'axios-mock-adapter';
import 'jest-dom/extend-expect';
import { axios } from '../../../api';

import renderWithRouter from '../../../tests';
import Dashboard from '../Dashboard';

describe('Dashboard Component', () => {
  let mock;
  const API_HOST = 'http://localhost:4000';

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(cleanup);

  test(':: successful response with 200 displays CB welcome message', async () => {
    expect.assertions(1);

    mock.onGet(`${API_HOST}/api/v1/organisations/me`)
      .reply(200, {
        result: {
          id: 3,
          name: 'Frog Finders',
          sector: 'Environment or nature',
          email: 'findmyfroggy@frogfinders.com',
          logoUrl: null,
          date: '2018-01-11T21:50:10.000Z' } },
      );

    const { getByText } =
      renderWithRouter()(Dashboard);

    const insertedCbNameInSubtitle = await waitForElement(() => getByText('Frog', { exact: false }));

    expect(insertedCbNameInSubtitle.textContent).toEqual('Edit what is happening at Frog Finders');
  });

  test(':: unsuccessful response with 401 redirects to login', async () => {
    expect.assertions(1);

    mock.onGet(`${API_HOST}/api/v1/organisations/me`)
      .reply(401, { result: null, error: 'Credentials not recognised' });

    const { history } =
      renderWithRouter()(Dashboard);

    await wait(() => history.length === 2);
    expect(history.location.pathname).toEqual('/cb/login');
  });
});
