const express = require('express');
const insertActivity = require('../database/queries/insertActivity');

const router = express.Router();

router.post('/', (req, res, next) => {
  const activityToAdd = req.body;
  insertActivity(activityToAdd.name, req.auth.cb_id)
    .then(result => res.send(result.id))
    .catch(next);
});

module.exports = router;
