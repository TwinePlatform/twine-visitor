import {
  fireEvent,
  cleanup,
  waitForElement,
  wait,
} from 'react-testing-library';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import 'jest-dom/extend-expect';

import renderWithRouter from '../../../tests';
import Activities from '../Activities';


describe('Activities Component', () => {
  let mock;

  beforeAll(() => {
    mock = new MockAdapter(axios);
    mock.onGet('/api/activities/all')
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
        }] },
      { authorization: 'authstring' });

    mock.onPost('/api/activity/add')
      .reply(200, { result: {
        id: 14,
        name: 'Cycling',
        cb_id: 4,
        deleted: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
        date: '2018-07-27T00:15:16.510Z' } },
      { authorization: 'authstring' });

    mock.onPost('/api/activity/update')
      .reply(200,
        { result: {
          id: 8,
          name: 'French Lessons',
          cb_id: 4,
          deleted: false,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: false,
          sunday: false,
          date: '2017-12-22T17:24:57.000Z',
        } },
        { authorization: 'authstring' });

    mock.onPost('/api/activity/delete')
      .reply(200, { result: null }, { authorization: 'authstring' });
  });

  afterEach(cleanup);

  test('page load :: correct response renders rows for each activity', async () => {
    expect.assertions(3);
    const { getByText } =
          renderWithRouter({ auth: 'authstring', updateAdminToken: () => {} })(Activities);
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
    const { getByText, getByLabelText } =
          renderWithRouter({ auth: 'authstring', updateAdminToken: () => {} })(Activities);

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
          renderWithRouter({ auth: 'authstring', updateAdminToken: () => {} })(Activities);

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
        renderWithRouter({ auth: 'authstring', updateAdminToken: () => {} })(Activities);

    const [frenchLessons, deleteButton] = await waitForElement(() => [
      getByText('French Lessons'),
      getByTestId('Delete French Lessons')]);

    fireEvent.click(deleteButton);

    await wait(() => expect(frenchLessons).not.toBeInTheDocument(),
    );
  });
});
