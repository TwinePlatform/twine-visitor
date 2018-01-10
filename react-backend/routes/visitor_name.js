const express = require('express');
const validator = require('validator');

const router = express.Router();

const getHash = require('../database/queries/getHash');

router.post('/', (req, res, next) => {
  const hashToCheck = req.body.user;

  if (!validator.isHash(req.body.user, ['sha256'])) {
    return res.send({ fullname: 'Bad hash', hash: '0' });
  }

  getHash(hashToCheck)
    .then(fullname => res.send(fullname))
    .catch(err => {
      if (err.message !== 'No user found') return next(err);

      res.send({ fullname: 'there is no registered user', hash: '0' });
    });
});

module.exports = router;
