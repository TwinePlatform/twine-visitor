/*
 * Twine API interface
 */
import _axios, { create } from 'axios';
import { map, head, pathOr, equals, compose } from 'ramda';
import qs from 'qs';


export const axios = create({
  baseURL: 'http://localhost:4000/v1/',
  withCredentials: true,
  paramsSerializer: params => qs.stringify(params, { encode: false }),
});

export const Activities = {
  categories: () => axios.get('/visit_activity_categories'),

  get: params => axios.get('/community-businesses/me/visit-activities', params),

  create: ({ name, category }) =>
    axios.post('/community-businesses/me/visit-activities', { name, category }),

  update: ({ id, monday, tuesday, wednesday, thursday, friday, saturday, sunday }) =>
    axios.put(`/community-businesses/me/visit-activities/${id}`, {
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
  genders: () => axios.get('/genders'),

  ethnicities: () => axios.get('/ethnicities'),

  disabilities: () => axios.get('/disabilities'),

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
      `/community-businesses/me/visitors/${id}`,
      {
        name,
        gender,
        email,
        phoneNumber,
        birthYear,
      },
    ),

  sendQrCode: ({ id }) =>
    axios.post(`/community-businesses/me/visitors/${id}/emails`, { type: 'qrcode' }),

  createVisit: ({ visitorId, hash, activityId }) =>
    axios.post(
      '/community-businesses/me/visit-logs',
      {
        userId: visitorId,
        visitActivityId: activityId,
        qrCode: hash,
      },
    ),
};

export const CbAdmin = {
  get: params =>
    axios.get('/users/me', params),

  update: ({ email }) =>
    axios.put('/users/me', { email }),

  login: ({ email, password }) =>
    axios.post('/users/login/admin', { email, password }),

  logout: () =>
    axios.get('/users/logout'),

  upgradePermissions: ({ password }) =>
    axios.post('/users/login/escalate', { password }),

  downgradePermissions: () =>
    axios.post('/users/login/de-escalate'),

  forgotPassword: ({ email }) =>
    axios.post('/users/password/forgot', { email }),

  resetPassword: ({ password, confirmPassword, token }) =>
    axios.post('/users/password/reset', { password, confirmPassword, token }),

};

export const CommunityBusiness = {
  sectors: () => axios.get('/sectors'),

  regions: () => axios.get('/regions'),

  get: params => axios.get('/community-businesses/me', params),

  getVisits: params => axios.get('/community-businesses/me/visit-logs', { params }),

  getVisitAggregates: params => axios.get('/community-businesses/me/visit-logs/aggregates', { params }),

  getActivities: () => axios.get('/visit-activity-categories'),

  update: async ({ name, sector, region, logoUrl }) =>
    axios.put('/community-businesses/me', { name, sector, region, logoUrl }),

  getFeedback: (since, until) =>
    axios.get('/community-businesses/me/feedback/aggregates', {
      params: {
        since: since ? since.toISOString() : undefined,
        until: until ? until.toISOString() : undefined,
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
