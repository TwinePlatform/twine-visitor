const cbAdmin = require('../models/cb-admin');

module.exports = (req, res, next) => {
  const pgPool = req.app.get('client:psql');

  if (!req.body.query || !req.body.query.feedbackScore) {
    return res
      .status(400)
      .send({ error: { message: 'Failed to add feedback to database' } });
  }

  const { feedbackScore } = req.body.query;

  if (feedbackScore !== -1 && feedbackScore !== 0 && feedbackScore !== 1) {
    return res
      .status(400)
      .send({ error: { message: 'Failed to add feedback to database' } });
  }

  cbAdmin
    .insertFeedback(pgPool, { cbId: req.auth.cb_id, feedbackScore })
    .then(data => res.send({ result: data }))
    .catch(next);
};
