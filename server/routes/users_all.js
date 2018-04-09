const router = require('express').Router();
const usersAll = require('../database/queries/users_all');

router.get('/', (req, res, next) => {
  usersAll(req.app.get('client:psql'), req.auth.cb_id)
    .then(users => res.send({ result: users }))
    .catch(err => next(err));
});

module.exports = router;
