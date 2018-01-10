const express = require('express');
const deleteActivity = require('../database/queries/deleteActivity');

const router = express.Router();

router.post('/', (req, res, next) => {
  deleteActivity(req.body, req.auth.cb_id)
    .then(() => {
      res.send('success');
    })
    .catch(next);
});

module.exports = router;
