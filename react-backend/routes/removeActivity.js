const express = require('express');

const router = express.Router();

const deleteActivity = require('../database/queries/deleteActivity');

router.post('/', (req, res, next) => {
  console.log('I am a community business id: ', req.auth);
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    const activityToRemove = JSON.parse(body);
    console.log('im about to be deleted: ', 'id: ', activityToRemove);
    deleteActivity(activityToRemove, req.auth.cb_id, (error, result) => {
      if (error) {
        console.log('I am an error from deleteActivity ', error);
        res.status(500).send(error);
      } else {
        res.send('success');
      }
    });
  });
});

module.exports = router;
