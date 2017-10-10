const express = require('express');

const router = express.Router();

const getAllUsers = require('../database/queries/getAllUsers');

router.get('/', (req, res) => {
  getAllUsers()
    .then(users => res.send({users}))
    .catch((err) => {
      console.log("Look, I am a caught error ", err);
    })
});


module.exports = router;
