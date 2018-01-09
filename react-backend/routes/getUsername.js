const express = require('express');
const validator = require('validator');

const router = express.Router();

const getHash = require('../database/queries/getHash');

router.post('/', (req, res, next) => {
  let hashToCheck = req.body.user;

  if (!validator.isHash(hashToCheck, ['sha256'])) {
    hashToCheck = 'WAS NOT HASH!';
    console.log('WAS NOT HASH!');
  }

  getHash(hashToCheck)
    .then(fullname => res.send(fullname))
    .catch((err) => {
      res.send({ fullname: 'there is no registered user', hash: '0' });
    });
});

module.exports = router;
