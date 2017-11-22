const express = require('express');

const router = express.Router();

const activities = require('../database/queries/activities');

router.get('/', (req, res) => {
  activities()
    .then(activities => res.send({ activities }))
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
