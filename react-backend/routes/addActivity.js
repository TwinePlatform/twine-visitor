const express = require('express');

const router = express.Router();

const insertActivity = require('../database/queries/insertActivity');

router.post('/', (req, res, next) => {
  console.log(req.auth.email);
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    const activityToAdd = JSON.parse(body);
    console.log(
      'im on the way to the database: ',
      'id: ',
      activityToAdd.id,
      'name: ',
      activityToAdd.name,
      'cb id: ',
      req.auth.cb_id,
    );
    insertActivity(activityToAdd.id, activityToAdd.name, req.auth.cb_id, (error, result) => {
      if (error) {
        console.log('I am an error from insertActivity ', error);
        res.status(500).send(error);
      } else {
        res.send('success');
      }
    });
  });
});

module.exports = router;
