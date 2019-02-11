import {
  cleanup,
  waitForElement,
  fireEvent,
} from 'react-testing-library';
import MockAdapter from 'axios-mock-adapter';
import 'jest-dom/extend-expect';
import { axios } from '../../../api';

import { renderWithRouter } from '../../../tests';
import AnonUser from '../AnonUser/index';

describe('AnonUser Component', () => {
  let mock;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(cleanup);

  test(':: successful anon user creation', async () => {
    expect.assertions(1);

    mock.onPut('/community-businesses/me')
      .reply(200, { result: null });


    mock.onGet('/genders')
      .reply(200, { result: [{ id: 1, name: 'male' }, { id: 2, name: 'female' }, { id: 3, name: 'prefer not to say' }] });

    mock.onGet('/community-businesses/me')
      .reply(200, { result: { name: 'Frog Finders', logoUrl: './', id: 6 } });

    mock
      .onPost('/users/register/visitors').reply(200, {
        result: {
          id: 711,
          name: 'Anonymous woman',
          email: 'anon_8_org_6',
          birthYear: 1988,
          postCode: null,
          phoneNumber: null,
          isEmailConfirmed: false,
          isPhoneNumberConfirmed: false,
          isEmailConsentGranted: false,
          isSMSConsentGranted: false,
          createdAt: (new Date()).toDateString(),
          modifiedAt: null,
          deletedAt: null,
          gender: 'female',
          ethnicity: 'prefer not to say',
          disability: 'prefer not to say',
          qrCode: 'data:image/png;base64,QRHASH' } });


    const { getByText, getByLabelText } = renderWithRouter()(AnonUser);

    // wait page to be ready by waiting for gender list to be populated
    await waitForElement(() => getByText('female', { exact: false }));


    const [
      name,
      gender,
      year,
      submit,
    ] = await waitForElement(() => [
      getByLabelText('Anonymous Account Name'),
      getByLabelText('Gender'),
      getByLabelText('Year of Birth'),
      getByText('CREATE'),
    ]);

    fireEvent.change(name, { target: { value: 'Anonymous woman' } });
    fireEvent.change(gender, { target: { value: 'female' } });
    fireEvent.change(year, { target: { value: 1988 } });

    fireEvent.click(submit);

    // checks create page is on second stage and has QR CODE & print options
    await waitForElement(() => getByText('print this', { exact: false }));

    const printButton = getByText('PRINT QR', { exact: false });
    expect(printButton.textContent).toBe('PRINT QR CODE');
  });
});
