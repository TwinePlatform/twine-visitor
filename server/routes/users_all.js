const router = require('express').Router();
const { pickBy, identity, pipe, dissoc, assoc } = require('ramda');
const usersAll = require('../database/queries/users_all');
const Joi = require('joi');
const { validate } = require('../shared/middleware');


const schema = {
  query: {
    page: Joi.number().integer().required(),
    sort: Joi.any().valid('', 'id', 'name', 'email', 'gender', 'yob', 'email_consent', 'sms_consent'), 
    sex: Joi.any().valid('', 'male', 'female', 'prefer not to say'),
    age: Joi.any().valid('', '0-17', '18-35', '35-50', '51-69', '70+'),
  },
};

const ageRange = (ageString) => ageString
    .replace('+','')
    .split('-')
    .map(x => 2018 - x)
    .reverse();

router.get('/', validate(schema), async (req, res, next) => {
  try {
    const removeSort = dissoc('sort');
    const removePage = dissoc('page');
    const removeAge = dissoc('age');
    const removeEmpty = pickBy(identity);
    const addCbId = assoc('cb_id',req.auth.cb_id);
  
    const query = req.query; 
    const queryPipe = pipe(removeSort, removePage, removeAge, removeEmpty, addCbId);
    const options = {
      where: queryPipe(query), 
      between: query.age ? { column: 'yearofbirth', values: ageRange(query.age)} : null,
      sort: query.sort ? query.sort : null,
      pagination: { offset: query.page } };
    
    const result = await usersAll(req.app.get('client:psql'), options);
    res.send({ result });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
