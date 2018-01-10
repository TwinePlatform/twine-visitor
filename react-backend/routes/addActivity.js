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
    insertActivity(activityToAdd.name, req.auth.cb_id)
      .then((result) => {
        res.send(result.id);
      })
      .catch((error) => {
        console.log('I am an error from insertActivity ', error);
        res.status(500).send(error);
      });
  });
});

module.exports = router;
