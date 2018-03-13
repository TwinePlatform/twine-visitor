const jwt = require('jsonwebtoken');
const cbAdmin = require('../models/cb-admin');

const route = ('/',
(req, res, next) => {
  const pgPool = req.app.get('client:psql');
  const standardJwtSecret = req.app.get('cfg').session.standard_jwt_secret;
  const { feedbackScore } = req.body;
  const { authorization: token } = req.headers;

  jwt.verify(token, standardJwtSecret, (err, decoded) => {
    const { email: cbEmail } = decoded;

    cbAdmin
      .postFeedback(pgPool, { cbEmail, feedbackScore })
      .then(data => res.send({ result: data }))
      .catch(next);
  });
});

module.exports = route;
