const router = require('express').Router();
const Joi = require('joi');
const Boom = require('boom');
const activityAdd = require('../database/queries/activity_add');
const activityCheckExists = require('../database/queries/activity_exists');
const { validate } = require('../shared/middleware');

const schema = {
  body: {
    name: Joi.string().required(),
  },
};

router.post('/', validate(schema), async (req, res, next) => {
  const activityToAdd = req.body.name;
  const pgClient = req.app.get('client:psql');
  try {
    const exists = await activityCheckExists(pgClient, activityToAdd, req.auth.cb_id);
    
    if (exists) {
      return next(Boom.conflict('Activity already exists'));
    }

    const data = await activityAdd(pgClient, activityToAdd, req.auth.cb_id);
    return res.send({ result: data });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
