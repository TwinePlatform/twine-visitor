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
    const name = data.formSender.split(' ').join('');
    if (validator.isEmail(data.formEmail) && validator.isAlpha(name, ['en-GB'])) {
      getUserAlreadyExists(data.formSender, data.formEmail, (error, result) => {
        if (error) {
          console.log('error from getUserAlreadyExists ', error);
        } else {
          res.send(result.rows[0].exists);
        }
      });
    } else if (!(validator.isEmail(data.formEmail)) && validator.isAlpha(name, ['en-GB'])) {
      console.log('This isnt a correct email!?');
      res.send('email');
    } else if (validator.isEmail(data.formEmail) && !(validator.isAlpha(name, ['en-GB']))) {
      console.log('This isnt a correct name!?');
      res.send('name');
    } else {
      console.log('Both name and email are wrong!!!');
      res.send('emailname');
    }
  });
});

module.exports = router;
