/*
 * Twine API interface
 */
import _axios from 'axios'; // eslint-disable-line
// 👆🏽 to be removed

import { create } from 'axios'; // eslint-disable-line
import { map, head, pathOr, equals, compose } from 'ramda';

require('env2')(`${__dirname}/../../../config/config.env`);

const API_HOST = process.env.API_HOST_DOMAIN;

export const axios = create({
  baseURL: 'http://localhost:4000/v1/',
  withCredentials: true,
});

export const Activities = {
  get: ({ weekday = 'all' } = {}) =>
    _axios.get(`/api/activities/${weekday}`),

  create: ({ name }) =>
    _axios.post('/api/activity/add', { name }),

  update: ({ id, monday, tuesday, wednesday, thursday, friday, saturday, sunday }) =>
    _axios.post(
      '/api/activity/update',
      { id, monday, tuesday, wednesday, thursday, friday, saturday, sunday },

    ),

  delete: ({ id }) =>
    _axios.post('/api/activity/delete', { id }),
};

export const Visitors = {
  get: (query) => {
    if (!query) {
      return _axios.get('/api/users/all');
    } else if (query.visitors) {
      return _axios.get('/api/users/all', {
        params: {
          pagination: query.pagination || null,
          offset: query.offset,
          sort: query.sort,
          gender: query.genderFilter,
          age: query.ageFilter,
        },

      });
    } else if (query.filter || query.sort) {
      return _axios.post(
        '/api/visitors/filtered',
        {
          filterBy: query.filter,
          orderBy: Object.keys(query.sort)[0],
        },

      );
    } else if (query.name && query.email) {
      return _axios.post(
        '/api/visit/check',
        {
          formSender: query.name,
          formEmail: query.email,
          formPhone: query.phone_number,
          formGender: query.gender,
          formYear: query.yob,
        },

      );
    } else if (query.id) {
      return _axios.post(
        '/api/user/details',
        {
          userId: query.id,
        },

      );
    } else if (query.hash) {
      return _axios.post(
        query.asAdmin ? '/api/user/qr' : '/api/user/name-from-scan',
        {
          hash: query.hash,
        },

      );
    } else if (query.withVisits) {
      return _axios.get('/api/visitors/all', {
        params: {
          pagination: query.pagination || null,
          offset: query.offset || null,
          gender: query.genderFilter,
          age: query.ageFilter,
          activity: query.activityFilter,
        },

      });
    }

    return Promise.reject(new Error('Invalid query parameters'));
  },

  create: (

    { name, gender, yob, email, phoneNumber, emailContactConsent, smsContactConsent },
  ) =>
    _axios.post(
      `${API_HOST}/api/v1/users/register/visitor`,
      {
        name,
        gender,
        birthYear: yob,
        email,
        phoneNumber,
        emailConsent: emailContactConsent,
        smsConsent: smsContactConsent,
      },
    ),

  update: (

    { id, name, gender, yob, email, phoneNumber }, // eslint-disable-line
  ) =>
    _axios.post(
      '/api/user/details/update',
      {
        userId: id,
        userFullName: name,
        sex: gender,
        yearOfBirth: yob,
        email,
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

  createVisit: ({ hash, activity }) =>
    _axios.post(
      '/api/visit/add',
      {
        hash,
        activity,
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
  get: () => axios.get('/community-businesses/me'),

  create: ({ orgName, category, email, password, passwordConfirm, region }) =>
    _axios.post('/api/cb/register', {
      orgName,
      email,
      category,
      region,
      password,
      passwordConfirm,
    }),

  update: (

    { orgName, sector, email, region, logoUrl }, // eslint-disable-line
  ) =>
    _axios.post(
      '/api/cb/details/update',
      {
        org_name: orgName,
        genre: sector,
        email,
        uploadedFileCloudinaryUrl: logoUrl,
      },
    ),

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
    _axios.post(
      '/api/admin/login',
      {
        password,
      },

    ),

  email: ({ email }) =>
    _axios.post('/api/cb/pwd/reset', {
      email,
    }),

  getFeedback: (since, until) =>
    _axios.get('/api/cb/feedback', {
      params: {
        since: since ? since.format('YYYY-MM-DDTHH:mm:ss.SSSZ') : '',
        until: until ? until.format('YYYY-MM-DDTHH:mm:ss.SSSZ') : '',
      },

    }),
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
