const express = require('express');
const getUsersFilteredBy = require('../database/queries/getUsersFilteredBy');

const router = express.Router();

router.post('/', (req, res, next) => {
  getUsersFilteredBy(req.auth.cb_id, {
    filterBy: req.body.filterBy,
    orderBy: req.body.orderBy,
  })
    .then(users => res.send({ success: true, users }))
    .catch(next);
});

module.exports = router;
