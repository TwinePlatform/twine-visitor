const jwt = require('jsonwebtoken');
const cbAdmin = require('../models/cb-admin');

module.exports = (req, res, next) => {
  const pgPool = req.app.get('client:psql');
  const standardJwtSecret = req.app.get('cfg').session.standard_jwt_secret;
  const { feedbackScore } = req.body;
  const { authorization: token } = req.headers;

  jwt.verify(token, standardJwtSecret, (err, decoded) => {
    if (err) return next;

    const { email: cbEmail } = decoded;

    cbAdmin
      .insertFeedback(pgPool, { cbEmail, feedbackScore })
      .then(data => res.send({ result: data }))
      .catch(() =>
        res
          .status(400)
          .send({ error: { message: 'Failed to add feedback to database' } })
      );
  });
};
