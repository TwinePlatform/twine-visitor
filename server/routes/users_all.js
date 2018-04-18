const router = require('express').Router();
const { pickBy, identity, pipe, omit, assoc } = require('ramda');
const moment = require('moment');
const usersAll = require('../database/queries/users_all');
const Joi = require('joi');
const { validate } = require('../shared/middleware');

const schema = {
  query: {
    offset: Joi.number()
      .integer()
      .min(0)
      .required(),
    sort: Joi.any().valid(
      '',
      'id',
      'name',
      'email',
      'gender',
      'yob',
      'email_consent',
      'sms_consent'
    ),
    sex: Joi.any().valid('', 'male', 'female', 'prefer not to say'),
    age: Joi.any().valid('', '0-17', '18-35', '35-50', '51-69', '70+'),
  },
};

const ageRange = ageString =>
  ageString
    .replace('+', '')
    .split('-')
    .map(x => moment().year() - x)
    .reverse();

const removeProperties = omit(['sort', 'offset', 'age']);
const removeEmpty = pickBy(identity);

router.get('/', validate(schema), async (req, res, next) => {
  try {
    const query = req.query;

    const addCbId = assoc('cb_id', req.auth.cb_id);
    const queryPipe = pipe(removeProperties, removeEmpty, addCbId);

    const options = {
      where: queryPipe(query),
      between: query.age
        ? { column: 'yearofbirth', values: ageRange(query.age) }
        : null,
      sort: query.sort ? query.sort : null,
      pagination: { offset: query.offset },
    };

    const result = await usersAll(req.app.get('client:psql'), options);
    res.send({ result });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
