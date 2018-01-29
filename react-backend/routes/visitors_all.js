const express = require('express');
const getAllUsers = require('../database/queries/getAllUsers');

const router = express.Router();

router.post('/', (req, res, next) => {
  getAllUsers(req.auth.cb_id)
    .then(users => res.send({ users, token: req.auth.adminToken }))
    .catch(next);
});

module.exports = router;
