const validator = require('validator');

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
    if ((validator.isEmail(data.formEmail)) && (validator.isAlpha(data.formSender, ['en-GB']))) {
      // console.log(data.formSender);
      // console.log(validator.isAlpha(`${data.formSender}`, ['en-GB']));
      getUserAlreadyExists(data.formSender, data.formEmail, (error, result) => {
        if (error) {
          console.log('error from getUserAlreadyExists ', error);
        } else {
          res.send(result.rows[0].exists);
        }
      });
    } else {
      res.send(true);
      // console.log(validator.isAlpha(`${data.formSender}`, ['en-GB']));
    }
  });
});

module.exports = router;
