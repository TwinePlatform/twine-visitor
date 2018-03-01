const express = require('express');
const activities = require('../database/queries/activities');

const router = express.Router();

router.get('/', (req, res, next) => {
  activities(req.app.get('client:psql'), req.auth.cb_id)
    .then(activities => res.send({ activities }))
    .catch(next);
});

module.exports = router;
