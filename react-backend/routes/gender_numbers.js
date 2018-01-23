const express = require('express');
const getGenderNumbers = require('../database/queries/genderNumbers');

const router = express.Router();

router.get('/', (req, res, next) => {
  getGenderNumbers(req.auth.cb_id)
    .then(numbers => res.send({ numbers }))
    .catch(next);
});

module.exports = router;
