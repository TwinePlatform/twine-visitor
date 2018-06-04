const router = require('express').Router();
const validator = require('validator');
const Boom = require('boom');
const getHash = require('../database/queries/user_check_hash');

router.post('/', (req, res, next) => {
  const hashToCheck = req.body.hash;
  const pgClient = req.app.get('client:psql');

  if (!validator.isHash(hashToCheck, ['sha256'])) {
    return next(Boom.badRequest('Invalid hash'));
  }

  getHash(pgClient, hashToCheck)
    .then(
      (fullname) => res.send(fullname),
      (err) => next(Boom.unauthorized(err.message))
    )
    .catch(next);
});

module.exports = router;
