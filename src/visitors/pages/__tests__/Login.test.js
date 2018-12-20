import {
  cleanup,
  waitForElement,
  fireEvent,
  wait,
} from 'react-testing-library';
import MockAdapter from 'axios-mock-adapter';
import { axios } from '../../../api';
import { renderWithRouter, MockResponses, MockInstaScan } from '../../../tests';
import main from '../Login';

describe('Visitor Login Component', () => {
  let mock;

  beforeAll(() => {
    global.Instascan = MockInstaScan;
    mock = new MockAdapter(axios);
  });

  afterEach(cleanup);

  describe('No activities', () => {
    const activities = [];

    test('No activities prevents sign in', async () => {
      MockResponses.CbAdmins.downGradePermissions[200](mock);
      MockResponses.Activities.get[200](mock, { day: 'today' }, { result: activities });
      MockResponses.CommunityBusinesses.get[200](mock, undefined, { result: { name: 'Foo' } });

      const tools = renderWithRouter({ route: '/visitor/login' })(main);

      await waitForElement(() => tools.getByText('There are no activities scheduled today.'));
    });
  });

  describe('Login with name', () => {
    const activities = [
      { id: 1, name: 'Yoga' },
      { id: 2, name: 'Fencing' },
    ];
    const activityNames = activities.map(a => a.name);

    test('Successful sign in with name', async () => {
      MockResponses.CbAdmins.downGradePermissions[200](mock);
      MockResponses.Activities.get[200](mock, { day: 'today' }, { result: activities });
      MockResponses.CommunityBusinesses.get[200](mock, undefined, { result: { name: 'Foo' } });
      MockResponses.Visitors.get[200](mock, { filter: { name: 'Bar' }, fields: ['id', 'name'] }, { result: [{ id: 1, name: 'Bar' }] });

      const tools = renderWithRouter({ route: '/visitor/login' })(main);

      // Wait for sign in page to appear after initial fetch
      await waitForElement(() => tools.getByText('Please select how you would like to log in'));
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
      MockResponses.CbAdmins.downGradePermissions[200](mock);
      MockResponses.Activities.get[200](mock, { day: 'today' }, { result: activities });
      MockResponses.CommunityBusinesses.get[200](mock, undefined, { result: { name: 'Foo' } });
      MockResponses.Visitors.get[200](mock, { filter: { name: 'Bar' }, fields: ['id', 'name'] }, { result: [] });

      const tools = renderWithRouter({ route: '/visitor/login' })(main);

      // Wait for sign in page to appear after initial fetch
      await waitForElement(() => tools.getByText('Please select how you would like to log in'));
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

      MockResponses.CbAdmins.downGradePermissions[200](mock);
      MockResponses.Activities.get[200](mock, { day: 'today' }, { result: activities });
      MockResponses.CommunityBusinesses.get[200](mock, undefined, { result: { name: 'Foo' } });
      MockResponses.Visitors.get[200](mock, { filter: { name: 'Bar' }, fields: ['id', 'name'] }, { result: [{ id: 1, name: 'Bar' }, { id: 2, name: 'Bar' }] });
      MockResponses.Visitors.get[200](mock, { filter: { name: 'Bar', age: [age, age] }, fields: ['id', 'name'] }, { result: [{ id: 1, name: 'Bar' }] });

      const tools = renderWithRouter({ route: '/visitor/login' })(main);

      // Wait for sign in page to appear after initial fetch
      await waitForElement(() => tools.getByText('Please select how you would like to log in'));
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

      MockResponses.CbAdmins.downGradePermissions[200](mock);
      MockResponses.Activities.get[200](mock, { day: 'today' }, { result: activities });
      MockResponses.CommunityBusinesses.get[200](mock, undefined, { result: { name: 'Foo' } });
      MockResponses.Visitors.get[200](mock, { filter: { name: 'Bar', age: [age, age] }, fields: ['id', 'name'] }, { result: [] });

      const tools = renderWithRouter({ route: '/visitor/login' })(main);

      // Wait for sign in page to appear after initial fetch
      await waitForElement(() => tools.getByText('Please select how you would like to log in'));
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

      MockResponses.CbAdmins.downGradePermissions[200](mock);
      MockResponses.Activities.get[200](mock, { day: 'today' }, { result: activities });
      MockResponses.CommunityBusinesses.get[200](mock, undefined, { result: { name: 'Foo' } });
      MockResponses.Visitors.get[200](mock, { filter: { name: 'Bar' }, fields: ['id', 'name'] }, { result: [{ id: 1, name: 'Bar' }, { id: 2, name: 'Bar' }] });
      MockResponses.Visitors.get[200](mock, { filter: { name: 'Bar', age: [age, age] }, fields: ['id', 'name'] }, { result: [{ id: 1, name: 'Bar' }, { id: 2, name: 'Bar' }] });
      MockResponses.Visitors.get[200](mock, { filter: { name: 'Bar', age: [age, age], email: 'bar@foo.com' }, fields: ['id', 'name'] }, { result: [{ id: 1, name: 'Bar' }] });

      const tools = renderWithRouter({ route: '/visitor/login' })(main);

      // Wait for sign in page to appear after initial fetch
      await waitForElement(() => tools.getByText('Please select how you would like to log in'));
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

      // Wait for re-render of e-mail input
      const emailInput = await waitForElement(() => tools.getByLabelText('E-mail you registered with'));

      // Input e-mail and sign in
      fireEvent.change(emailInput, { target: { value: 'bar@foo.com' } });
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

      MockResponses.CbAdmins.downGradePermissions[200](mock);
      MockResponses.Activities.get[200](mock, { day: 'today' }, { result: activities });
      MockResponses.CommunityBusinesses.get[200](mock, undefined, { result: { name: 'Foo' } });
      MockResponses.Visitors.get[200](mock, { filter: { name: 'Bar' }, fields: ['id', 'name'] }, { result: [{ id: 1, name: 'Bar' }, { id: 2, name: 'Bar' }] });
      MockResponses.Visitors.get[200](mock, { filter: { name: 'Bar', age: [age, age] }, fields: ['id', 'name'] }, { result: [{ id: 1, name: 'Bar' }, { id: 2, name: 'Bar' }] });
      MockResponses.Visitors.get[200](mock, { filter: { name: 'Bar', age: [age, age], email: 'bar@foo.com' }, fields: ['id', 'name'] }, { result: [] });

      const tools = renderWithRouter({ route: '/visitor/login' })(main);

      // Wait for sign in page to appear after initial fetch
      await waitForElement(() => tools.getByText('Please select how you would like to log in'));
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
  });

  // Once we have a good mock of the QR scanning library
  describe.skip('Login with QRCode', () => {});
});
