const express = require('express');

const router = express.Router();

const updateActivity = require('../database/queries/updateActivity');

router.post('/', (req, res, next) => {
  console.log('I am a community business id: ', req.auth);
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    const activityToUpdate = JSON.parse(body);
    updateActivity(
      activityToUpdate.id,
      activityToUpdate.monday,
      activityToUpdate.tuesday,
      activityToUpdate.wednesday,
      activityToUpdate.thursday,
      activityToUpdate.friday,
      activityToUpdate.saturday,
      activityToUpdate.sunday,
      req.auth.cb_id,
    )
      .then((result) => {
        res.send('success');
      })
      .catch((error) => {
        console.log('I am an error from updateActivity ', error);
        res.status(500).send(error);
      });
  });
});

module.exports = router;
