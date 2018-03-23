const cbAdmin = require('../models/cb_admin');

const createDate = str => {
  const date = new Date(str);
  if (date instanceof Date && !isNaN(date.valueOf())) return date;
  throw Error('invalid date');
};

module.exports = {
  get: (req, res, next) => {
    const pgPool = req.app.get('client:psql');
    try {
      const reqQuery = req.query;

      const dbQuery = { cbId: req.auth.cb_id };

      if (reqQuery.since) {
        dbQuery.since = createDate(reqQuery.since);
      }

      if (reqQuery.until) {
        dbQuery.until = createDate(reqQuery.until);
      }

      cbAdmin
        .getFeedback(pgPool, dbQuery)
        .then(data => res.send({ result: data }))
        .catch(next);
    } catch (error) {
      return res
        .status(400)
        .send({ error: { message: 'Failed to get feedback from database' } });
    }
  },
  post: (req, res, next) => {
    const pgPool = req.app.get('client:psql');
    try {
      const reqQuery = req.body.query;
      const { feedbackScore } = reqQuery;

      if (feedbackScore !== -1 && feedbackScore !== 0 && feedbackScore !== 1) {
        throw new Error('Invalid feedback score');
      }

      cbAdmin
        .insertFeedback(pgPool, { cbId: req.auth.cb_id, feedbackScore })
        .then(data => res.send({ result: data }))
        .catch(next);
    } catch (error) {
      return res
        .status(400)
        .send({ error: { message: 'Failed to add feedback to database' } });
    }
  },
};
