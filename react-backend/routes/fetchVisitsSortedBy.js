const express = require('express');

const router = express.Router();

const getVisitsSortedBy = require('../database/queries/getVisitsSortedBy');

router.post('/', (req, res, next) => {
  getVisitsSortedBy(req.auth.cb_id, req.body.sortBy)
    .then(users => res.send({ success: true, users }))
    .catch(next);
});

module.exports = router;
