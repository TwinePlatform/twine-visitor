const express = require('express');
const activityAdd = require('../database/queries/activity_add');

const router = express.Router();

router.post('/', (req, res, next) => {
  const activityToAdd = req.body.name;
  activityAdd(activityToAdd, req.auth.cb_id)
    .then(id => res.send({ id }))
    .catch(next);
});

module.exports = router;
