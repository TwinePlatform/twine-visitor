const express = require('express');

const jwt = require('jsonwebtoken');

const router = express.Router();

const activities = require('../database/queries/activities');

router.get('/', (req, res) => {
  activities(req.auth.cb_id)
    .then(activities => res.send({ activities }))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});
module.exports = router;
