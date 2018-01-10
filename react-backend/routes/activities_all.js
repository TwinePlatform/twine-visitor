const express = require('express');
const getActivities = require('../database/queries/activities');

const router = express.Router();

router.get('/', (req, res, next) => {
  getActivities(req.auth.cb_id)
    .then(activities => res.send({ activities }))
    .catch(next);
});

module.exports = router;
