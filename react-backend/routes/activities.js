const express = require('express');

const jwt = require('jsonwebtoken');

const router = express.Router();

const activities = require('../database/queries/activities');

router.get('/', (req, res) => {
  jwt.verify(req.headers.authorization, process.env.SECRET, (err, payload) => {
    if (err) {
      console.log(err);
      res.send(JSON.stringify({ error: 'Not logged in' }));
    } else {
      activities()
        .then(activities => res.send({ activities }))
        .catch((err) => {
          console.log(err);
        });
    }
  });
});

module.exports = router;
