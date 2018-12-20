import {
  cleanup,
  waitForElement,
} from 'react-testing-library';
import MockAdapter from 'axios-mock-adapter';
import 'jest-dom/extend-expect';
import { axios } from '../../../api';

import { renderWithRouter } from '../../../tests';
import Feedback from '../Feedback';


describe('Feedback Component', () => {
  let mock;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(cleanup);

  test('Fetches feedback on mount and renders doughnut', async () => {
    expect.assertions(1);

    mock
      .onGet('/community-businesses/me/feedback/aggregates')
      .reply(200, { result: { totalFeedback: 14, '-1': 3, 0: 5, 1: 6 } });

    const { getByTestId } = renderWithRouter()(Feedback);
    const donut = await waitForElement(() => getByTestId('doughnut'));

    expect(donut).toBeTruthy();
  });

  test('Fetch result empty on mount renders placeholder message', async () => {
    expect.assertions(1);

    mock
      .onGet('/community-businesses/me/feedback/aggregates')
      .reply(200, { result: { totalFeedback: 0, '-1': 0, 0: 0, 1: 0 } });

    const { getByTestId } = renderWithRouter()(Feedback);
    const donutError = await waitForElement(() => getByTestId('doughnut-error'));

    expect(donutError).toBeTruthy();
  });

  test('Fetch error on mount renders placeholder message', async () => {
    expect.assertions(1);

    mock
      .onGet('/community-businesses/me/feedback/aggregates')
      .reply(400, { error: {} });

    const { getByTestId } = renderWithRouter()(Feedback);
    const donutError = await waitForElement(() => getByTestId('doughnut-error'));

    expect(donutError).toBeTruthy();
  });
});
