const express = require('express');
const validator = require('validator');
const router = express.Router();

const getHash = require('../database/queries/getHash');

router.post('/', (req, res, next) => {
  const hashToCheck = req.body.user

  if (!(validator.isHash(hashToCheck, ['sha256']))) {
    return Promise.reject('WAS NOT HASH!')
  }

  getHash(hashToCheck)
    .then(fullname => res.send({fullname}))
    .catch((err) => {
      console.log("Look, I am a caught error ", err);
    })
});


module.exports = router;
