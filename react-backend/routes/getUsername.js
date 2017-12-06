const express = require('express');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const router = express.Router();

const getHash = require('../database/queries/getHash');

router.post('/', (req, res, next) => {
  jwt.verify(req.headers.authorization, process.env.SECRET, (err, payload) => {
    if (err) {
      console.log(err);
      res.send(JSON.stringify({ error: 'Not logged in' }));
    } else {
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
    }
  });
});

module.exports = router;
