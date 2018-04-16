/*
 *
 */
import axios from 'axios';
import { map, head, pathOr, equals, compose } from 'ramda';


export const Activities = {
  get: (tkn, { weekday = 'all' } = {}) =>
    axios.get(
      `/api/activities/${weekday}`,
      { headers: { Authorization: tkn } },
    ),

  create: (tkn, { name }) =>
    axios.post(
      '/api/activity/add',
      { name },
      { headers: { Authorization: tkn } },
    ),

  update: (tkn, { id, monday, tuesday, wednesday, thursday, friday, saturday, sunday }) =>
    axios.post(
      '/api/activity/update',
      { id, monday, tuesday, wednesday, thursday, friday, saturday, sunday },
      { headers: { Authorization: tkn } },
    ),

  delete: (tkn, { id }) =>
    axios.post(
      '/api/activity/delete',
      { id },
      { headers: { Authorization: tkn } },
    ),

};


export const Visitors = {
  get: (tkn, query) => {
    if (!query) {
      return axios.get(
        '/api/users/all',
        { headers: { Authorization: tkn } },
      );
    } else if (query.page) {
      return axios.get(
        '/api/users/all'
        , { params: {
          page: query.page,
          sort: query.sort,
          sex: query.genderFilter,
          age: query.ageFilter,
        },
        headers: { Authorization: tkn } },
      );
    } else if (query.filter || query.sort) {
      return axios.post(
        '/api/visitors/filtered',
        {
          filterBy: query.filter,
          orderBy: Object.keys(query.sort)[0],
        },
        { headers: { Authorization: tkn } },
      );

    } else if (query.name && query.email) {
      return axios.post(
        '/api/visit/check',
        {
          formSender: query.name,
          formEmail: query.email,
          formPhone: query.phone_number,
          formGender: query.gender,
          formYear: query.yob,
        },
        { headers: { Authorization: tkn } },
      );

    } else if (query.id) {
      return axios.post(
        '/api/user/details',
        {
          userId: query.id,
        },
        { headers: { Authorization: tkn } },
      );

    } else if (query.hash) {
      return axios.post(
        query.asAdmin ? '/api/user/qr' : '/api/user/name-from-scan',
        {
          hash: query.hash,
        },
        { headers: { Authorization: tkn } },
      );
    } else if (query.withVisits) {
      return axios.post(
        '/api/visitors/all',
        {},
        { headers: { Authorization: tkn } },
      );

    }

    return Promise.reject(new Error('Invalid query parameters'));
  },

  create: (tkn, {
    name,
    gender,
    yob,
    email,
    phoneNumber,
    emailContactConsent,
    smsContactConsent,
  }) =>
    axios.post(
      '/api/qr/generator',
      {
        formSender: name,
        formGender: gender,
        formYear: yob,
        formEmail: email,
        formPhone: phoneNumber,
        formEmailContact: emailContactConsent,
        formSmsContact: smsContactConsent,
      },
      { headers: { Authorization: tkn } },
    ),

  update: (tkn, { id, name, gender, yob, email, phoneNumber }) => // eslint-disable-line
    axios.post(
      '/api/user/details/update',
      {
        userId: id,
        userFullName: name,
        sex: gender,
        yearOfBirth: yob,
        email,
      },
      { headers: { Authorization: tkn } },
    ),

  delete: () => { },

  email: (tkn, { id }) =>
    axios.post(
      '/api/user/qr/email',
      {
        id,
      },
      { headers: { Authorization: tkn } },
    ),

  createVisit: (tkn, { hash, activity }) =>
    axios.post(
      '/api/visit/add',
      {
        hash,
        activity,
      },
      { headers: { Authorization: tkn } },
    ),

  getStatistics: (tkn, { groupBy, sort, filter } = {}) => {
    if (groupBy || filter || sort) {
      return axios.post(
        '/api/users/filtered',
        {
          filterBy: filter,
          orderBy: Object.keys(sort)[0],
        },
        { headers: { Authorization: tkn } },
      );
    }

    return axios.get(
      '/api/users/chart-all',
      { headers: { Authorization: tkn } },
    );
  },
};


export const CbAdmin = {
  get: tkn =>
    axios.post(
      '/api/cb/details',
      {},
      { headers: { Authorization: tkn } },
    ),

  __DEPRECATED_get: tkn => axios.get( // eslint-disable-line
    '/api/users/cb-name',
    { headers: { Authorization: tkn } },
  ),

  create: ({ orgName, category, email, password, passwordConfirm }) =>
    axios.post(
      '/api/cb/register',
      {
        orgName,
        email,
        category,
        password,
        passwordConfirm,
      },
    ),

  update: (tkn, { orgName, sector, email, region, logoUrl }) => // eslint-disable-line
    axios.post(
      '/api/cb/details/update',
      {
        org_name: orgName,
        genre: sector,
        email,
        uploadedFileCloudinaryUrl: logoUrl,
      },
      { headers: { Authorization: tkn } },
    ),

  delete: () => { },

  resetPassword: (tkn, { password, passwordConfirm }) =>
    axios.post(
      '/api/cb/pwd/change',
      {
        password,
        passwordConfirm,
        token: tkn,
      },
    ),

  login: ({ email, password }) =>
    axios.post(
      '/api/cb/login',
      {
        email,
        password,
      },
    ),

  upgradePermissions: (tkn, { password }) =>
    axios.post(
      '/api/admin/login',
      {
        password,
      },
      { headers: { Authorization: tkn } },
    ),

  email: (tkn, { email }) =>
    axios.post(
      '/api/cb/pwd/reset',
      {
        email,
      },
    ),

  getFeedback: (tkn, since, until) =>
    axios.get(
      '/api/cb/feedback',
      { params: {
        since: since ? since.format('YYYY-MM-DDTHH:mm:ss.SSSZ') : '',
        until: until ? until.format('YYYY-MM-DDTHH:mm:ss.SSSZ') : '',
      },
      headers: { Authorization: tkn } },
    ),
};


export const Cloudinary = {
  UPLOAD_URL: 'https://api.cloudinary.com/v1_1/dqzxe8mav/upload',
  UPLOAD_PRESET: 'cklrrn9k',

  upload: (file) => {
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', Cloudinary.UPLOAD_PRESET);

    return axios.post(
      Cloudinary.UPLOAD_URL,
      form,
    );
  },
};


export const ErrorUtils = {
  getErrorStatus: pathOr(null, ['response', 'status']),
  getValidationErrors: compose(map(head), pathOr({ general: ['Unknown error'] }, ['response', 'data', 'validation'])),
  errorStatusEquals: (error, status) => equals(ErrorUtils.getErrorStatus(error), status),
};


export default {
  Activities,
  Visitors,
  CbAdmin,
  Cloudinary,
  ErrorUtils,
};
