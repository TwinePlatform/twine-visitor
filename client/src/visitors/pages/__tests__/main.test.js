import {
  cleanup,
  waitForElement,
  fireEvent,
  wait,
} from 'react-testing-library';
import MockAdapter from 'axios-mock-adapter';
import { axios } from '../../../api';
import renderWithRouter from '../../../tests';
import main from '../main';


describe('Visitor Registration Component', () => {
  let mock;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(cleanup);

  test('submit form w/ correct payload renders QR code', async () => {
    expect.assertions(1);

    const visitor = {
      id: 1,
      name: 'Jill Valentine',
      gender: 'female',
      birthYear: 1988,
      email: 'jvizzle@umbrellacorp.com',
      phoneNumber: '+447777777777',
      postCode: 'SG33 6JD',
      emailConsent: true,
      smsConsent: false,
      qrCode: 'data:image/png;base64,329t4ji3nfp23nfergj42finoregn',
    };

    mock.onPost('/users/register/visitor').reply(200, { result: { ...visitor } })
      .onGet('/community-businesses/me').reply(200, { result: { name: 'cbName', logoUrl: 'cbURL', id: 1 } })
      .onGet('/users/me')
      .reply(200, { result: {} });

    const tools = renderWithRouter({ route: '/visitor/signup' })(main);

    const [
      fullName,
      email,
      phoneNumber,
      gender,
      birthYear,
      emailConsent,
      submit,
    ] = await waitForElement(() => [
      tools.getByLabelText('Full Name'),
      tools.getByLabelText('Email Address'),
      tools.getByLabelText('Phone Number (optional)'),
      tools.getByLabelText('Gender'),
      tools.getByLabelText('Year of Birth'),
      tools.getByTestId('emailConsent'),
      tools.getByText('CONTINUE'),
    ]);

    fullName.value = visitor.name;
    email.value = visitor.email;
    phoneNumber.value = visitor.phoneNumber;
    gender.value = visitor.gender;
    birthYear.value = visitor.birthYear;
    emailConsent.value = visitor.emailConsent;

    fireEvent.change(fullName);
    fireEvent.change(email);
    fireEvent.change(phoneNumber);
    fireEvent.change(gender);
    fireEvent.change(birthYear);
    fireEvent.change(emailConsent);
    fireEvent.click(submit);

    await wait(() => {
      expect(tools.history.location.pathname).toBe('/visitor/signup/thankyou');
    });
  });
});
