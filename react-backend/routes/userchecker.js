const express = require('express');

const router = express.Router();
const getUserAlreadyExists = require('../database/queries/getUserAlreadyExists');

router.post('/', (req, res, next) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    const data = JSON.parse(body);
    getUserAlreadyExists(data.formSender, data.formEmail, (error, result) => {
      if (error) {
        console.log('error from getUserAlreadyExists ', error)
      } else {
        res.send(result.rows[0].exists);
      }
    });
  });
});

module.exports = router;
