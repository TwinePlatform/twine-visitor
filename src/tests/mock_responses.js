export const Activities = {
  get: {
    200: (mock, params, response) =>
      mock.onGet('/community-businesses/me/visit-activities', { params }).reply(200, response || { result: [] }),
    401: (mock, params, response) =>
      mock.onGet('/community-businesses/me/visit-activities', { params }).reply(401, response || { result: [] }),
  },
};

export const CommunityBusinesses = {
  get: {
    200: (mock, params, response) =>
      mock.onGet('/community-businesses/me', { params }).reply(200, response || { result: {} }),
    401: (mock, params, response) =>
      mock.onGet('/community-businesses/me', { params }).reply(401, response || { result: {} }),
  },
};

export const CbAdmins = {
  downGradePermissions: {
    200: mock =>
      mock.onPost('/users/login/de-escalate').reply(200, { result: null }),
    401: (mock, response) =>
      mock.onPost('/users/login/de-escalate').reply(401, response || { result: null }),
  },
};

export const Visitors = {
  get: {
    200: (mock, params, response) =>
      mock.onGet('/community-businesses/me/visitors', { params }).reply(200, response || { result: null }),
  },
  getOne: {
    200: (mock, id, params, response) =>
      mock.onGet(`/community-businesses/me/visitors${id}`, { params }).reply(200, response || { result: null }),
  },
};
