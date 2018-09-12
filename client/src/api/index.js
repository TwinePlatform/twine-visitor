/*
 * Twine API interface
 */
import _axios, { create } from 'axios';
import { map, head, pathOr, equals, compose } from 'ramda';
import qs from 'qs';


export const axios = create({
  baseURL: 'http://localhost:4000/v1/',
  withCredentials: true,
  paramsSerializer: qs.stringify,
});

export const Activities = {
  get: params => axios.get('/community-businesses/me/visit-activities', params),

  create: ({ name, category }) =>
    axios.post('/community-businesses/me/visit-activities', { name, category }),

  update: ({ id, monday, tuesday, wednesday, thursday, friday, saturday, sunday }) =>
    axios.put(`/community-businesses/me/visit-activities/${id}`, {
      id,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      sunday,
    }),

  delete: ({ id }) =>
    axios.delete(`/community-businesses/me/visit-activities/${id}`),
};

export const Visitors = {
  get: ({ id }, params) =>
    axios.get(`/community-businesses/me/visitors${id ? `/${id}` : ''}`, { params }),

  search: ({ hash }) =>
    axios.post('/users/visitors/search', { qrCode: hash }),

  create: (
    { name, gender, birthYear, email, phoneNumber, emailContactConsent, smsContactConsent },
  ) =>
    axios.post(
      '/users/register/visitor',
      {
        name,
        gender,
        birthYear,
        email,
        phoneNumber,
        emailConsent: emailContactConsent,
        smsConsent: smsContactConsent,
      },
    ),

  update: ({ id, name, gender, birthYear, email, phoneNumber }) =>
    axios.put(
      `/users/${id}`,
      {
        name,
        gender,
        email,
        phoneNumber,
        birthYear,
      },
    ),

  delete: () => {},

  email: ({ id }) =>
    _axios.post(
      '/api/user/qr/email',
      {
        id,
      },

    ),

  createVisit: ({ visitorId, hash, activityId }) =>
    axios.post(
      '/community-businesses/me/visit-logs',
      {
        userId: visitorId,
        visitActivityId: activityId,
        qrCode: hash,
      },
    ),

  getStatistics: ({ groupBy, sort, filter } = {}) => {
    if (groupBy || filter || sort) {
      return _axios.post(
        '/api/users/filtered',
        {
          filterBy: filter,
          orderBy: Object.keys(sort)[0],
        },
      );
    }

    return _axios.get('/api/users/chart-all');
  },
};

export const CbAdmin = {
  get: async () => {
    const [cbRes, userRes] = await Promise.all([
      axios.get('/community-businesses/me'),
      axios.get('/users/me'),
    ]);

    return { data: { result: { ...cbRes.data.result, email: userRes.data.result.email } } };
  },

  create: ({ orgName, category, email, password, passwordConfirm, region }) =>
    _axios.post('/api/cb/register', {
      orgName,
      email,
      category,
      region,
      password,
      passwordConfirm,
    }),

  update: async ({ name, sector, email, region, logoUrl }) => {
    const putCb = axios.put('/community-businesses/me', { name, sector, region, logoUrl });
    const putUser = (email
      ? axios.put('/users/me', { email })
      : Promise.resolve({ data: { result: { email: email || null } } }));

    const [resCb, resUser] = await Promise.all([putCb, putUser]);

    return { data: { result: { ...resCb.data.result, email: resUser.data.result.email } } };
  },

  delete: () => {},

  resetPassword: ({ password, passwordConfirm }) =>
    _axios.post('/api/cb/pwd/change', {
      password,
      passwordConfirm,
    }),

  login: ({ email, password }) =>
    axios.post('/users/login/admin',
      {
        email,
        password,
      },
    ),

  upgradePermissions: ({ password }) =>
    axios.post('/users/login/escalate', { password }),

  email: ({ email }) =>
    _axios.post('/api/cb/pwd/reset', {
      email,
    }),

  getFeedback: (since, until) =>
    axios.get('/community-businesses/me/feedback/aggregates', {
      params: {
        since: since ? since.format('YYYY-MM-DDTHH:mm:ss.SSSZ') : null,
        until: until ? until.format('YYYY-MM-DDTHH:mm:ss.SSSZ') : null,
      },
    }),

  postFeedback: score =>
    axios.post(
      '/community-businesses/me/feedback',
      { feedbackScore: score },
    ),
};

export const Cloudinary = {
  UPLOAD_URL: 'https://api.cloudinary.com/v1_1/dqzxe8mav/upload',
  UPLOAD_PRESET: 'cklrrn9k',

  upload: (file) => {
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', Cloudinary.UPLOAD_PRESET);

    return _axios.post(Cloudinary.UPLOAD_URL, form);
  },
};

export const ErrorUtils = {
  getErrorStatus: pathOr(null, ['response', 'status']),
  getValidationErrors: compose(
    map(head),
    pathOr({ general: ['Unknown error'] }, ['response', 'data', 'validation']),
  ),
  errorStatusEquals: (error, status) => equals(ErrorUtils.getErrorStatus(error), status),
};

export const logout = () =>
  axios.get('/users/logout')
;

export const Constants = {
  getActivities: () => axios.get('/visit-activity-categories'),
};
