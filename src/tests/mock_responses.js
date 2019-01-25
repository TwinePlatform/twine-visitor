/*
 * Mock API responses for component testing
 *
 * Public API of this module should have object structure that matches /api/index.js
 * That is, /api/index.js has `Activities.get`, so this module should too. However,
 * method signatures, obviously, don't need to match.
 *
 * All methods require the 'axios-mock-adapter' object instance to be passed in.
 *
 * Usage:
 *   Setting up a mock on the `Visitors.get` endpoint:
 * ```js
 * import MockAxios from 'axios-mock-adapter'
 * import axios from 'axios';
 * import { Visitors as VisitorsMock } from '../'
 *
 * const mock = new MockAxios(axios)
 *
 * // mocks "GET /community-businesses/me/visitors?visits=true"
 * VisitorsMock.get(mock, { params: { visits: true } });
 * ```
 *
 * Options:
 * All methods should take an options object with the follwing properties:
 *
 * - params: { k: v }
 *   Default: undefined
 *   Query parameters. For "GET" requests only
 *
 * - status: Number
 *   Default: 200
 *   HTTP status response code to simulate
 *
 * - response: { k: v } | string
 *   Default: { result: null }
 *   Full HTTP response body
 */


/*
 * Utility functions
 */
const get = (mock, url, { params, status = 200, response = { result: null } } = {}) =>
  mock.onGet(url, params ? { params } : undefined).reply(status, response);

const post = (mock, url, { body, status = 200, response = { result: null } } = {}) =>
  mock.onPost(url, body || undefined).reply(status, response);


/*
 * Public API
 */
export const Activities = {
  get: (mock, opts) =>
    get(mock, '/community-businesses/me/visit-activities', opts),
};

export const CommunityBusinesses = {
  get: (mock, opts) =>
    get(mock, '/community-businesses/me', opts),
};

export const CbAdmins = {
  downGradePermissions: (mock, opts) =>
    post(mock, '/users/login/de-escalate', opts),
};

export const Visitors = {
  get: (mock, opts) =>
    get(mock, '/community-businesses/me/visitors', opts),
  getOne: (mock, id, opts) =>
    get(mock, `/community-businesses/me/visitors/${id}`, opts),
};

