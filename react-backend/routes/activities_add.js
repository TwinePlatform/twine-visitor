const express = require('express');
const insertActivity = require('../database/queries/insertActivity');

const router = express.Router();

router.post('/', (req, res, next) => {
  const activityToAdd = req.body.name;
  insertActivity(activityToAdd, req.auth.cb_id)
    .then(id => res.send({ id, token: req.auth.adminToken }))
    .catch(next);
});

module.exports = router;
