const express = require('express');

const router = express.Router();

const deleteActivity = require('../database/queries/deleteActivity');

router.post('/', (req, res, next) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    const activityToRemove = JSON.parse(body);
    deleteActivity(activityToRemove, req.auth.cb_id)
      .then((result) => {
        res.send('success');
      })
      .catch((err) => {
        console.log('I am an error from deleteActivity ', error);
        res.status(500).send(error);
      });
  });
});

module.exports = router;
