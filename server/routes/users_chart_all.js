const express = require('express');
const getGenderNumbers = require('../database/queries/users_chart_all');

const router = express.Router();

router.get('/', (req, res, next) => {
  getGenderNumbers(req.app.get('client:psql'), req.auth.cb_id)
    .then((numbers) => res.send({ result: numbers }))
    .catch(next);
});

module.exports = router;
