import {
  fireEvent,
  cleanup,
  waitForElement,
  wait,
} from 'react-testing-library';
import MockAdapter from 'axios-mock-adapter';
import 'jest-dom/extend-expect';
import { axios } from '../../../api';

import renderWithRouter from '../../../tests';
import Activities from '../Activities';


describe('Activities Component', () => {
  let mock;

  beforeAll(() => {
    mock = new MockAdapter(axios);

    mock.onGet('/visit-activity-categories')
      .reply(200, { result: [
        { id: 1, name: 'Adult skills building' },
        { id: 2, name: 'Arts, Craft, and Music' },
        { id: 3, name: 'Business support' },
        { id: 4, name: 'Care service' },
        { id: 5, name: 'Education support' },
        { id: 6, name: 'Employment support' },
        { id: 7, name: 'Environment and conservation work' },
        { id: 8, name: 'Food' },
        { id: 9, name: 'Housing support' },
        { id: 10, name: 'Local products' },
        { id: 11, name: 'Mental health support' },
        { id: 12, name: 'Outdoor work and gardening' },
        { id: 13, name: 'Physical health and wellbeing' },
        { id: 14, name: 'Socialising' },
        { id: 15, name: 'Sports' },
        { id: 16, name: 'Transport' },
        { id: 17, name: 'Work space' }] });

    mock.onGet('/community-businesses/me/visit-activities')
      .reply(200, { result: [
        { id: 8,
          name: 'French Lessons',
          monday: false,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: false,
          sunday: false,
        },
        { id: 7,
          name: 'Yoga',
          monday: false,
          tuesday: false,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: false,
          sunday: false,
        },
        { id: 13,
          name: 'Skating',
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: true,
          friday: true,
          saturday: false,
          sunday: false,
        }] });

    mock.onPost('/community-businesses/me/visit-activities')
      .reply(200, { result: {
        id: 14,
        name: 'Cycling',
        deleted: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
        date: '2018-07-27T00:15:16.510Z' } });

    mock.onPut('/community-businesses/me/visit-activities/8')
      .reply(200,
        { result: {
          id: 8,
          name: 'French Lessons',
          deleted: false,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: false,
          sunday: false,
          date: '2017-12-22T17:24:57.000Z',
        } });

    mock.onDelete('/community-businesses/me/visit-activities/8')
      .reply(200, { result: null });
  });

  afterEach(cleanup);

  test('page load :: correct response renders rows for each activity', async () => {
    expect.assertions(3);
    const { getByText } =
          renderWithRouter()(Activities);
    const [french, yoga, skating] = await waitForElement(() => [
      getByText('French Lessons'),
      getByText('Yoga'),
      getByText('Skating'),
    ]);

    expect(french.textContent).toEqual('French Lessons');
    expect(yoga.textContent).toEqual('Yoga');
    expect(skating.textContent).toEqual('Skating');
  });

  test('add :: correct response adds new row', async () => {
    expect.assertions(1);
    const { getByText, getByLabelText } = renderWithRouter()(Activities);

    const input = getByLabelText('Add an activity');
    const add = getByText('ADD');
    input.value = 'Cycling';
    fireEvent.change(input);
    await waitForElement(() => getByText('French Lessons'));
    fireEvent.click(add);

    const cycling = await waitForElement(() => getByText('Cycling'));

    expect(cycling.textContent).toEqual('Cycling');
  });

  test('update :: correct response updates specified row', async () => {
    expect.assertions(2);
    const { getByAltText } =
          renderWithRouter()(Activities);

    const checkbox = await waitForElement(() => getByAltText('French Lessons monday update button'));
    expect(checkbox.checked).toBeFalsy();
    fireEvent.click(checkbox);

    await wait(() => {
      const updatedCheck = getByAltText('French Lessons monday update button');
      return expect(updatedCheck.checked).toBeTruthy();
    });
  });

  test('delete :: correct response deletes specified row', async () => {
    expect.assertions(1);
    const { getByText, getByTestId } =
        renderWithRouter()(Activities);

    const [frenchLessons, deleteButton] = await waitForElement(() => [
      getByText('French Lessons'),
      getByTestId('Delete French Lessons')]);

    fireEvent.click(deleteButton);

    await wait(() => expect(frenchLessons).not.toBeInTheDocument(),
    );
  });
});
