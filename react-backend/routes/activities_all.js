const express = require('express');
const getActivities = require('../database/queries/activities');

const router = express.Router();

router.get('/', (req, res, next) => {
  console.log(req.auth);

  getActivities(req.auth.cb_id)
    .then(activities => {
      console.log(activities);
      res.send({ activities, token: req.auth.adminToken });
    })
    .catch(next);
});

module.exports = router;
