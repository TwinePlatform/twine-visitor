const express = require('express');
const activityAdd = require('../database/queries/activity_add');

const router = express.Router();

router.post('/', (req, res, next) => {
  const activityToAdd = req.body.name;
  const pgClient = req.app.get('client:psql');

  activityAdd(pgClient, activityToAdd, req.auth.cb_id)
    .then(data => res.send({ result: data }))
    .catch(next);
});

module.exports = router;
