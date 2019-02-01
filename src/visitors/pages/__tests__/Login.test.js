import {
  cleanup,
  waitForElement,
  fireEvent,
  wait,
} from 'react-testing-library';
import MockAdapter from 'axios-mock-adapter';
import { axios } from '../../../api';
import { renderWithRouter, MockResponses, MockInstaScan } from '../../../tests';
import SignInForm from '../SignIn/SignInForm';
import main from '../SignIn';

describe('Visitor SignIn Component', () => {
  let mock;

  beforeAll(() => {
    global.Instascan = MockInstaScan;
    mock = new MockAdapter(axios);
  });

  afterEach(cleanup);

  describe('No activities', () => {
    const activities = [];

    test('No activities prevents sign in', async () => {
      MockResponses.CbAdmins.downGradePermissions(mock);
      MockResponses.Activities.get(mock, { params: { day: 'today' }, response: { result: activities } });
      MockResponses.CommunityBusinesses.get(mock, { response: { result: { name: 'Foo' } } });

      const tools = renderWithRouter({ route: '/visitor/login?type=name' })(main);

      await waitForElement(() => tools.getByText('There are no activities scheduled today.'));
    });
  });

  describe('Sign in with name', () => {
    const activities = [
      { id: 1, name: 'Yoga' },
      { id: 2, name: 'Fencing' },
    ];
    const activityNames = activities.map(a => a.name);

    test('Successful sign in with name', async () => {
      MockResponses.CbAdmins.downGradePermissions(mock);
      MockResponses.Activities.get(mock, { params: { day: 'today' }, response: { result: activities } });
      MockResponses.CommunityBusinesses.get(mock, { response: { result: { name: 'Foo' } } });
      MockResponses.Visitors.get(mock, { params: { filter: { name: 'Bar' }, fields: ['id', ...SignInForm.Fields] }, response: { result: [{ id: 1, name: 'Bar' }] } });

      const tools = renderWithRouter({ route: '/visitor/login?type=name' })(main);

      // Wait for sign in page to appear after initial fetch
      await waitForElement(() => tools.getByText('Or, please enter the details you signed up with'));
      const nameInput = await waitForElement(() => tools.getByLabelText('Your name'));
      const btn = await waitForElement(() => tools.getByText('Sign in'));

      // Input unique name and sign in
      fireEvent.change(nameInput, { target: { value: 'Bar' } });
      fireEvent.click(btn);

      // Wait for re-render of activities grid
      await waitForElement(() => tools.getByText('Welcome back, Bar! Why are you here today?'));
      const activitiesBtns = await waitForElement(() => activityNames.map(a => tools.getByText(a)));

      expect(activitiesBtns.map(b => b.textContent)).toEqual(activityNames);
    });

    test('Name not recognised, unsuccessful sign in', async () => {
      MockResponses.CbAdmins.downGradePermissions(mock);
      MockResponses.Activities.get(mock, { params: { day: 'today' }, response: { result: activities } });
      MockResponses.CommunityBusinesses.get(mock, { response: { result: { name: 'Foo' } } });
      MockResponses.Visitors.get(mock, { params: { filter: { name: 'Bar' }, fields: ['id', ...SignInForm.Fields] }, response: { result: [] } });

      const tools = renderWithRouter({ route: '/visitor/login?type=name' })(main);

      // Wait for sign in page to appear after initial fetch
      await waitForElement(() => tools.getByText('Or, please enter the details you signed up with'));
      const nameInput = await waitForElement(() => tools.getByLabelText('Your name'));
      const btn = await waitForElement(() => tools.getByText('Sign in'));

      // Input unique name and sign in
      fireEvent.change(nameInput, { target: { value: 'Bar' } });
      fireEvent.click(btn);

      await wait(() => {
        expect(tools.history.location.pathname).toBe('/visitor/qrerror');
        expect(tools.history.location.search).toBe('?e=no_user');
      });
    });

    test('Duplicated name, successful sign in with birth year', async () => {
      const now = new Date().getFullYear();
      const age = 20;
      const yob = now - age;

      MockResponses.CbAdmins.downGradePermissions(mock);
      MockResponses.Activities.get(mock, { params: { day: 'today' }, response: { result: activities } });
      MockResponses.CommunityBusinesses.get(mock, { response: { result: { name: 'Foo' } } });
      MockResponses.Visitors.get(mock, { params: { filter: { name: 'Bar' }, fields: ['id', ...SignInForm.Fields] }, response: { result: [{ id: 1, name: 'Bar', birthYear: yob }, { id: 2, name: 'Bar', birthYear: yob + 1 }] } });
      MockResponses.Visitors.get(mock, { params: { filter: { name: 'Bar', age: [age, age] }, fields: ['id', ...SignInForm.Fields] }, response: { result: [{ id: 1, name: 'Bar' }] } });

      const tools = renderWithRouter({ route: '/visitor/login?type=name' })(main);

      // Wait for sign in page to appear after initial fetch
      await waitForElement(() => tools.getByText('Or, please enter the details you signed up with'));
      const nameInput = await waitForElement(() => tools.getByLabelText('Your name'));
      const btn = await waitForElement(() => tools.getByText('Sign in'));

      // Input name and sign in
      fireEvent.change(nameInput, { target: { value: 'Bar' } });
      fireEvent.click(btn);

      // Wait for re-render of YOB select box
      const yobInput = await waitForElement(() => tools.getBySelectText(''));

      // Input birth year and sign in
      fireEvent.change(yobInput, { target: { value: yob } });
      fireEvent.click(btn);

      // Wait for re-render of activities grid
      await waitForElement(() => tools.getByText('Welcome back, Bar! Why are you here today?'));
      const activitiesBtns = await waitForElement(() => activityNames.map(a => tools.getByText(a)));

      expect(activitiesBtns.map(b => b.textContent)).toEqual(activityNames);
    });

    test('Name + birth year not recognised, unsuccessful sign in', async () => {
      const now = new Date().getFullYear();
      const age = 20;
      const yob = now - age;

      MockResponses.CbAdmins.downGradePermissions(mock);
      MockResponses.Activities.get(mock, { params: { day: 'today' }, response: { result: activities } });
      MockResponses.CommunityBusinesses.get(mock, { response: { result: { name: 'Foo' } } });
      MockResponses.Visitors.get(mock, { params: { filter: { name: 'Bar', age: [age, age] }, fields: ['id', ...SignInForm.Fields] }, response: { result: [] } });

      const tools = renderWithRouter({ route: '/visitor/login?type=name' })(main);

      // Wait for sign in page to appear after initial fetch
      await waitForElement(() => tools.getByText('Or, please enter the details you signed up with'));
      const nameInput = await waitForElement(() => tools.getByLabelText('Your name'));
      const btn = await waitForElement(() => tools.getByText('Sign in'));

      // Input unique name and sign in
      fireEvent.change(nameInput, { target: { value: 'Bar' } });
      fireEvent.click(btn);

      // Wait for re-render of YOB select box
      const yobInput = await waitForElement(() => tools.getBySelectText(''));

      // Input birth year and sign in
      fireEvent.change(yobInput, { target: { value: yob } });
      fireEvent.click(btn);

      await wait(() => {
        expect(tools.history.location.pathname).toBe('/visitor/qrerror');
        expect(tools.history.location.search).toBe('?e=no_user');
      });
    });

    test('Duplicated name and birth year, successful sign in with email', async () => {
      const now = new Date().getFullYear();
      const age = 20;
      const yob = now - age;

      MockResponses.CbAdmins.downGradePermissions(mock);
      MockResponses.Activities.get(mock, { params: { day: 'today' }, response: { result: activities } });
      MockResponses.CommunityBusinesses.get(mock, { response: { result: { name: 'Foo' } } });
      MockResponses.Visitors.get(mock, { params: { filter: { name: 'Bar' }, fields: ['id', ...SignInForm.Fields] }, response: { result: [{ id: 1, name: 'Bar', birthYear: yob, email: 'bar1@cb.com', postCode: null }, { id: 2, name: 'Bar', birthYear: yob, email: 'bar2@cb.com', postCode: null }] } });
      MockResponses.Visitors.get(mock, { params: { filter: { name: 'Bar', email: 'bar1@cb.com' }, fields: ['id', ...SignInForm.Fields] }, response: { result: [{ id: 1, name: 'Bar', birthYear: yob, email: 'bar1@cb.com', postCode: null }] } });

      const tools = renderWithRouter({ route: '/visitor/login?type=name' })(main);

      // Wait for sign in page to appear after initial fetch
      await waitForElement(() => tools.getByText('Or, please enter the details you signed up with'));
      const nameInput = await waitForElement(() => tools.getByLabelText('Your name'));
      const btn = await waitForElement(() => tools.getByText('Sign in'));

      // Input name and sign in
      fireEvent.change(nameInput, { target: { value: 'Bar' } });
      fireEvent.click(btn);

      // YOB select box skipped because YOBs in the payload are the same
      // Wait for re-render of e-mail input
      const emailInput = await waitForElement(() => tools.getByLabelText('E-mail you registered with'));

      // Input e-mail and sign in
      fireEvent.change(emailInput, { target: { value: 'bar1@cb.com' } });
      fireEvent.click(btn);

      // Wait for re-render of activities grid
      await waitForElement(() => tools.getByText('Welcome back, Bar! Why are you here today?'));
      const activitiesBtns = await waitForElement(() => activityNames.map(a => tools.getByText(a)));

      expect(activitiesBtns.map(b => b.textContent)).toEqual(activityNames);
    });

    test('Name + birth year + email, unsuccessful sign in', async () => {
      const now = new Date().getFullYear();
      const age = 20;
      const yob = now - age;

      MockResponses.CbAdmins.downGradePermissions(mock);
      MockResponses.Activities.get(mock, { params: { day: 'today' }, response: { result: activities } });
      MockResponses.CommunityBusinesses.get(mock, { response: { result: { name: 'Foo' } } });
      MockResponses.Visitors.get(mock, { params: { filter: { name: 'Bar' }, fields: ['id', ...SignInForm.Fields] }, response: { result: [{ id: 1, name: 'Bar', birthYear: yob, email: 'bar1@cb.com' }, { id: 2, name: 'Bar', birthYear: yob, email: 'bar2@cb.com' }] } });
      MockResponses.Visitors.get(mock, { params: { filter: { name: 'Bar', age: [age, age], email: 'bar@foo.com' }, fields: ['id', ...SignInForm.Fields] }, response: { result: [] } });

      const tools = renderWithRouter({ route: '/visitor/login?type=name' })(main);

      // Wait for sign in page to appear after initial fetch
      await waitForElement(() => tools.getByText('Or, please enter the details you signed up with'));
      const nameInput = await waitForElement(() => tools.getByLabelText('Your name'));
      const btn = await waitForElement(() => tools.getByText('Sign in'));

      // Input name and sign in
      fireEvent.change(nameInput, { target: { value: 'Bar' } });
      fireEvent.click(btn);

      // YOB select doesn't appear because it's the same for both users
      // Wait for re-render of e-mail input
      const emailInput = await waitForElement(() => tools.getByLabelText('E-mail you registered with'));

      // Input e-mail and sign in
      fireEvent.change(emailInput, { target: { value: 'bar@foo.com' } });
      fireEvent.click(btn);

      await wait(() => {
        expect(tools.history.location.pathname).toBe('/visitor/qrerror');
        expect(tools.history.location.search).toBe('?e=no_user');
      });
    });

    test('name + post code, successful sign in', async () => {
      const now = new Date().getFullYear();
      const age = 20;
      const yob = now - age;

      MockResponses.CbAdmins.downGradePermissions(mock);
      MockResponses.Activities.get(mock, { params: { day: 'today' }, response: { result: activities } });
      MockResponses.CommunityBusinesses.get(mock, { response: { result: { name: 'Foo' } } });
      MockResponses.Visitors.get(mock, { params: { filter: { name: 'Bar' }, fields: ['id', ...SignInForm.Fields] }, response: { result: [{ id: 1, name: 'Bar', birthYear: yob, email: null, postCode: 'N1 2FH' }, { id: 2, name: 'Bar', birthYear: yob, email: null, postCode: 'NW2 4RF' }] } });
      MockResponses.Visitors.get(mock, { params: { filter: { name: 'Bar', postCode: 'N1 2FH' }, fields: ['id', ...SignInForm.Fields] }, response: { result: [{ id: 1, name: 'Bar', birthYear: yob, email: null, postCode: 'N1 2FH' }] } });

      const tools = renderWithRouter({ route: '/visitor/login?type=name' })(main);

      // Wait for sign in page to appear after initial fetch
      await waitForElement(() => tools.getByText('Or, please enter the details you signed up with'));
      const nameInput = await waitForElement(() => tools.getByLabelText('Your name'));
      const btn = await waitForElement(() => tools.getByText('Sign in'));

      // Input name and sign in
      fireEvent.change(nameInput, { target: { value: 'Bar' } });
      fireEvent.click(btn);

      // Wait for re-render of post code input
      const postCode = await waitForElement(() => tools.getByLabelText('Your post code'));

      // Input post code and sign in
      fireEvent.change(postCode, { target: { value: 'N1 2FH' } });
      fireEvent.click(btn);

      await waitForElement(() => tools.getByText('Welcome back, Bar! Why are you here today?'));
      const activitiesBtns = await waitForElement(() => activityNames.map(a => tools.getByText(a)));

      expect(activitiesBtns.map(b => b.textContent)).toEqual(activityNames);
    });
  });

  // Once we have a good mock of the QR scanning library
  describe.skip('Sign in with QRCode', () => {});
});
