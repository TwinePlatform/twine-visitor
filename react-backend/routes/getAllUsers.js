const express = require('express');

const jwt = require('jsonwebtoken');

const router = express.Router();

const getAllUsers = require('../database/queries/getAllUsers');

router.get('/', (req, res) => {
  console.log('I am req: ', req);
  console.log('I am headers.Authorization: ', req.headers.authorization);
  jwt.verify(req.headers.authorization, process.env.SECRET, (err, payload) => {
    if (err) {
      console.log(err);
      res.send(JSON.stringify({ error: 'Not logged in' }));
    } else {
      getAllUsers()
        .then(users => res.send({ users }))
        .catch((err) => {
          console.log(err);
        });
    }
  });
});

module.exports = router;
