import {
  cleanup,
  waitForElement,
  wait,
} from 'react-testing-library';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import renderWithRouter from '../../../tests';
import Settings from '../Settings';


describe('Settings Component', () => {
  let mock;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(cleanup);

  test(':: succesful load displays cbs details on page', async () => {
    expect.assertions(3);

    mock.onPost('/api/cb/details')
      .reply(200,
        { result: {
          id: 3,
          org_name: 'Frog Finders',
          genre: 'Environment or nature',
          email: 'findmyfroggy@frogfinders.com',
          uploadedfilecloudinaryurl: null,
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

    mock.onPost('/api/cb/details')
      .reply(401,
        { result: null,
        });

    const { history } = renderWithRouter()(Settings);

    await wait(() => expect(history.location.pathname).toEqual('/admin/login'));
  });
});
