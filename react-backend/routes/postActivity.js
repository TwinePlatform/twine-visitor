const express = require('express');

const jwt = require('jsonwebtoken');

const router = express.Router();

const putVisitsData = require('../database/queries/putVisitsData');

router.post('/', (req, res, next) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    const visitToAdd = JSON.parse(body);
    console.log(visitToAdd);
    putVisitsData(visitToAdd.hash, visitToAdd.activity, (error, result) => {
      if (error) {
        console.log('I am an error from putVisitsData ', error);
        res.status(500).send(error);
      } else {
        res.send('success');
      }
    });
  });
});

module.exports = router;
