const router = require('express').Router();
const usersFiltered = require('../database/queries/users_filtered');

router.post('/', (req, res, next) => {
  usersFiltered(req.auth.cb_id, {
    filterBy: req.body.filterBy,
    orderBy: req.body.orderBy,
  })
    .then(users => res.send({ users }))
    .catch(next);
});

module.exports = router;
