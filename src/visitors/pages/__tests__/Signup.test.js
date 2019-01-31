import {
  cleanup,
  waitForElement,
  fireEvent,
  wait,
} from 'react-testing-library';
import MockAdapter from 'axios-mock-adapter';
import { axios } from '../../../api';
import { renderWithRouter } from '../../../tests';
import main from '../Signup';


describe('Visitor Registration Component', () => {
  let mock;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(cleanup);

  test('submit form w/ email & phone number payload renders QR code', async () => {
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

    mock
      .onPost('/users/login/de-escalate')
      .reply(200, { data: null });

    mock.onPost('/users/register/visitors').reply(200, { result: { ...visitor } })
      .onGet('/community-businesses/me', { params: { fields: ['name', 'logoUrl', 'id'] } })
      .reply(200, { result: { name: 'cbName', logoUrl: 'cbURL', id: 1 } })
      .onGet('/users/me')
      .reply(200, { result: {} });

    mock
      .onGet('/genders')
      .reply(200, { result: [{ id: 1, name: 'male' }, { id: 2, name: 'female' }, { id: 3, name: 'prefer not to say' }] });

    const tools = renderWithRouter({ route: '/visitor/signup' })(main);

    // wait page to be ready by waiting for gender list to be populated
    await waitForElement(() => tools.getByText('female', { exact: false }));

    const [
      fullname,
      email,
      phoneNumber,
      gender,
      birthYear,
      emailConsent,
      submit,
    ] = await waitForElement(() => [
      tools.getByLabelText('Full Name'),
      tools.getByLabelText('Email Address'),
      tools.getByLabelText('Phone Number'),
      tools.getByLabelText('Gender'),
      tools.getByLabelText('Year of Birth'),
      tools.getByTestId('emailConsent'),
      tools.getByText('CONTINUE'),
    ]);

    fireEvent.change(fullname, { target: { value: visitor.name } });
    fireEvent.change(email, { target: { value: visitor.email } });
    fireEvent.change(phoneNumber, { target: { value: visitor.phoneNumber } });
    fireEvent.change(gender, { target: { value: visitor.gender } });
    fireEvent.change(birthYear, { target: { value: visitor.birthYear } });
    fireEvent.change(emailConsent, { target: { value: visitor.emailConsent } });
    fireEvent.click(submit);

    await wait(() => {
      expect(tools.history.location.pathname).toBe('/visitor/signup/thankyou');
    });
  });

  test('submit form w/ email payload renders QR code', async () => {
    expect.assertions(1);

    const visitor = {
      id: 1,
      name: 'Jill Valentine',
      gender: 'female',
      birthYear: 1988,
      email: 'jvizzle@umbrellacorp.com',
      phoneNumber: '',
      postCode: 'SG33 6JD',
      emailConsent: true,
      smsConsent: false,
      qrCode: 'data:image/png;base64,329t4ji3nfp23nfergj42finoregn',
    };

    mock
      .onPost('/users/login/de-escalate')
      .reply(200, { data: null });

    mock.onPost('/users/register/visitors').reply(200, { result: { ...visitor } })
      .onGet('/community-businesses/me', { params: { fields: ['name', 'logoUrl', 'id'] } })
      .reply(200, { result: { name: 'cbName', logoUrl: 'cbURL', id: 1 } })
      .onGet('/users/me')
      .reply(200, { result: {} });

    mock
      .onGet('/genders')
      .reply(200, { result: [{ id: 1, name: 'male' }, { id: 2, name: 'female' }, { id: 3, name: 'prefer not to say' }] });

    const tools = renderWithRouter({ route: '/visitor/signup' })(main);

    // wait page to be ready by waiting for gender list to be populated
    await waitForElement(() => tools.getByText('female', { exact: false }));

    const [
      fullname,
      email,
      phoneNumber,
      gender,
      birthYear,
      emailConsent,
      submit,
    ] = await waitForElement(() => [
      tools.getByLabelText('Full Name'),
      tools.getByLabelText('Email Address'),
      tools.getByLabelText('Phone Number'),
      tools.getByLabelText('Gender'),
      tools.getByLabelText('Year of Birth'),
      tools.getByTestId('emailConsent'),
      tools.getByText('CONTINUE'),
    ]);

    fireEvent.change(fullname, { target: { value: visitor.name } });
    fireEvent.change(email, { target: { value: visitor.email } });
    fireEvent.change(phoneNumber, { target: { value: visitor.phoneNumber } });
    fireEvent.change(gender, { target: { value: visitor.gender } });
    fireEvent.change(birthYear, { target: { value: visitor.birthYear } });
    fireEvent.change(emailConsent, { target: { value: visitor.emailConsent } });
    fireEvent.click(submit);

    await wait(() => {
      expect(tools.history.location.pathname).toBe('/visitor/signup/thankyou');
    });
  });

  test('submit form w/ phone number payload renders QR code', async () => {
    expect.assertions(1);

    const visitor = {
      id: 1,
      name: 'Jill Valentine',
      gender: 'female',
      birthYear: 1988,
      email: '',
      phoneNumber: '+447777777777',
      postCode: 'SG33 6JD',
      emailConsent: true,
      smsConsent: false,
      qrCode: 'data:image/png;base64,329t4ji3nfp23nfergj42finoregn',
    };

    mock
      .onPost('/users/login/de-escalate')
      .reply(200, { data: null });

    mock.onPost('/users/register/visitors').reply(200, { result: { ...visitor } })
      .onGet('/community-businesses/me', { params: { fields: ['name', 'logoUrl', 'id'] } })
      .reply(200, { result: { name: 'cbName', logoUrl: 'cbURL', id: 1 } })
      .onGet('/users/me')
      .reply(200, { result: {} });

    mock
      .onGet('/genders')
      .reply(200, { result: [{ id: 1, name: 'male' }, { id: 2, name: 'female' }, { id: 3, name: 'prefer not to say' }] });

    const tools = renderWithRouter({ route: '/visitor/signup' })(main);

    // wait page to be ready by waiting for gender list to be populated
    await waitForElement(() => tools.getByText('female', { exact: false }));

    const [
      fullname,
      email,
      phoneNumber,
      gender,
      birthYear,
      emailConsent,
      submit,
    ] = await waitForElement(() => [
      tools.getByLabelText('Full Name'),
      tools.getByLabelText('Email Address'),
      tools.getByLabelText('Phone Number'),
      tools.getByLabelText('Gender'),
      tools.getByLabelText('Year of Birth'),
      tools.getByTestId('emailConsent'),
      tools.getByText('CONTINUE'),
    ]);

    fireEvent.change(fullname, { target: { value: visitor.name } });
    fireEvent.change(email, { target: { value: visitor.email } });
    fireEvent.change(phoneNumber, { target: { value: visitor.phoneNumber } });
    fireEvent.change(gender, { target: { value: visitor.gender } });
    fireEvent.change(birthYear, { target: { value: visitor.birthYear } });
    fireEvent.change(emailConsent, { target: { value: visitor.emailConsent } });
    fireEvent.click(submit);

    await wait(() => {
      expect(tools.history.location.pathname).toBe('/visitor/signup/thankyou');
    });
  });

  test('submit form w/ duplicate email', async () => {
    expect.assertions(1);

    mock
      .onPost('/users/login/de-escalate')
      .reply(200, { data: null });

    mock
      .onGet('/genders')
      .reply(200, { result: [{ id: 1, name: 'male' }, { id: 2, name: 'female' }, { id: 3, name: 'prefer not to say' }] });


    mock.onPost('/users/register/visitors')
      .reply(409, { error: { statusCode: 409, message: 'User with this e-mail already registered' } });

    const tools = renderWithRouter({ route: '/visitor/signup' })(main);

    // wait page to be ready by waiting for gender list to be populated
    await waitForElement(() => tools.getByText('female', { exact: false }));

    const [
      fullname,
      email,
      gender,
      birthYear,
      submit,
    ] = await waitForElement(() => [
      tools.getByLabelText('Full Name'),
      tools.getByLabelText('Email Address'),
      tools.getByLabelText('Gender'),
      tools.getByLabelText('Year of Birth'),
      tools.getByText('CONTINUE'),
    ]);

    fireEvent.change(fullname, { target: { value: 'Sheva Alomar' } });
    fireEvent.change(email, { target: { value: '1@aperturescience.com' } });
    fireEvent.change(gender, { target: { value: 'female' } });
    fireEvent.change(birthYear, { target: { value: '1988' } });
    fireEvent.click(submit);

    const error = await waitForElement(() => tools.getByText('already registered', { exact: false }));
    expect(error.textContent).toBe('User with this e-mail already registered');
  });

  test('submit form w/o email or phone number', async () => {
    expect.assertions(1);

    mock
      .onPost('/users/login/de-escalate')
      .reply(200, { data: null });

    mock
      .onGet('/genders')
      .reply(200, { result: [{ id: 1, name: 'male' }, { id: 2, name: 'female' }, { id: 3, name: 'prefer not to say' }] });

    const tools = renderWithRouter({ route: '/visitor/signup' })(main);

    // wait page to be ready by waiting for gender list to be populated
    await waitForElement(() => tools.getByText('female', { exact: false }));

    const [
      fullname,
      gender,
      birthYear,
      submit,
    ] = await waitForElement(() => [
      tools.getByLabelText('Full Name'),
      tools.getByLabelText('Gender'),
      tools.getByLabelText('Year of Birth'),
      tools.getByText('CONTINUE'),
    ]);

    fireEvent.change(fullname, { target: { value: 'Sheva Alomar' } });
    fireEvent.change(gender, { target: { value: 'female' } });
    fireEvent.change(birthYear, { target: { value: '1988' } });
    fireEvent.click(submit);

    const error = await waitForElement(() => tools.getByText('supply', { exact: false }));
    expect(error.textContent).toBe('You must supply a phone number or email address');
  });
});
