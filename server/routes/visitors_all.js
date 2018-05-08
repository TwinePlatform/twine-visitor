const router = require('express').Router();
const { filter, identity, pipe, omit, assoc } = require('ramda');
const Joi = require('joi');
const { validate } = require('../shared/middleware');
const visitorsAll = require('../database/queries/visitors_all');
const { ageRange, renameKeys } = require('../shared/util/helpers');

const schema = {
  query: {
    pagination: Joi.bool(),
    offset: Joi.number()
      .integer()
      .min(0),
    gender: Joi.any().valid('', 'male', 'female', 'prefer not to say'),
    age: Joi.any().valid('', '0-17', '18-34', '35-50', '51-69', '70+'),
    activity: Joi.string().allow(''),
  },
};

const removeProperties = omit(['offset', 'age', 'pagination']);
const removeEmpty = filter(identity);
const renameActivityAndGender = renameKeys({
  activity: 'activities.name',
  gender: 'sex',
});

router.get('/', validate(schema), async (req, res, next) => {
  try {
    const { query } = req;
    const addCbId = assoc('users.cb_id', req.auth.cb_id);

    const createWhereObj = pipe(
      renameActivityAndGender,
      removeProperties,
      removeEmpty,
      addCbId
    );

    const options = {
      innerJoin: {
        visits: ['users.id', 'visits.usersid'],
        activities: ['visits.activitiesid', 'activities.id'],
      },
      where: createWhereObj(query),
      between: query.age
        ? { column: 'yearofbirth', values: ageRange(query.age) }
        : null,
      pagination: query.pagination ? { offset: query.offset || 0 } : null,
      sort: 'visit_date ASC',
    };

    const result = await visitorsAll(req.app.get('client:psql'), options);
    const full_count = +(result[0] || {}).full_count || 0;
    const data = result.map(omit('full_count'));

    res.send({ result: data, meta: { full_count } });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
