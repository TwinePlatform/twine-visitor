const express = require('express');

const router = express.Router();

const getHash = require('../database/queries/getHash');

let details = {};
let hashString = '';

router.post('/', (req, res, next) => {
  getHash(req.body.token)
    .then(fullname => res.send({fullname}))
    .catch((err) => {
      console.log("Look, I am a caught error ", err);
    })
});


module.exports = router;
