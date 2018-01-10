const express = require('express');

const router = express.Router();

const insertActivity = require('../database/queries/insertActivity');

router.post('/', (req, res, next) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    const activityName = JSON.parse(body);
    insertActivity(activityName, req.auth.cb_id)
      .then((id) => {
        res.send({ id });
      })
      .catch((error) => {
        console.log('I am an error from insertActivity ', error);
        res.status(500).send(error);
      });
  });
});

module.exports = router;
