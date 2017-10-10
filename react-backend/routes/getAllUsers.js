const express = require('express');

const router = express.Router();

const getAllUsers = require('../database/queries/getAllUsers');

router.get('/', (req, res) => {
  getAllUsers()
    .then(users => res.send({users}))
    .catch((err) => {
      console.log(err);
    })
});


module.exports = router;
