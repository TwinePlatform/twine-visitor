const router = require('express').Router();
const usersAll = require('../database/queries/users_all');

router.get('/', (req, res, next) => {
  usersAll(req.auth.cb_id)
    .then(users => res.send({ users }))
    .catch(err => next(err));
});

module.exports = router;
