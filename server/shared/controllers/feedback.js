const cbAdmin = require('../models/cb_admin');
const router = require('express').Router();
const Joi = require('joi');
const { validate } = require('../../shared/middleware');
const mwIsAuthenticated = require('../../routes/cbauthentication/mw_is_authenticated');
const mwAdminIsAuthenticated = require('../../routes/cbauthentication/mw_admin_is_authenticated');

const getSchema = {
  query: {
    since: Joi.date()
      .allow('')
      .required(),
    until: Joi.date()
      .allow('')
      .required(),
  },
};

const postSchema = {
  body: {
    query: Joi.object({
      feedbackScore: Joi.number()
        .integer()
        .required(),
    }),
  },
};

router.get(
  '/',
  mwAdminIsAuthenticated,
  validate(getSchema),
  (req, res, next) => {
    const pgPool = req.app.get('client:psql');
    const { since, until } = req.query;
    const dbQuery = { cbId: req.auth.cb_id };

    if (since) dbQuery.since = new Date(since);
    if (until) dbQuery.until = new Date(until);

    cbAdmin
      .getFeedback(pgPool, dbQuery)
      .then((data) => res.send({ result: data }))
      .catch(next);
  }
);

router.post('/', mwIsAuthenticated, validate(postSchema), (req, res, next) => {
  const pgPool = req.app.get('client:psql');
  const { feedbackScore } = req.body.query;

  cbAdmin
    .insertFeedback(pgPool, { cbId: req.auth.cb_id, feedbackScore })
    .then((data) => res.send({ result: data }))
    .catch(next);
});

module.exports = router;
