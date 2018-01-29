const router = require('express').Router();
const getUsersFilteredBy = require('../database/queries/getUsersFilteredBy');

router.post('/', (req, res, next) => {
  getUsersFilteredBy(req.auth.cb_id, {
    filterBy: req.body.filterBy,
    orderBy: req.body.orderBy,
  })
    .then(users => res.send({ token: req.auth.adminToken, users }))
    .catch(next);
});

module.exports = router;
