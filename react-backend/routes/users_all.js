const router = require('express').Router();
const getUserList = require('../database/queries/listAllUsers');

router.get('/', (req, res, next) => {
  getUserList(req.auth.cb_id)
    .then(users => res.send({ token: req.auth.adminToken, users }))
    .catch(err => next(err));
});

module.exports = router;
