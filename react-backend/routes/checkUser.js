const validator = require('validator');
const express = require('express');
const getUserAlreadyExists = require('../database/queries/getUserAlreadyExists');

const router = express.Router();

router.post('/', (req, res, next) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', () => {
    const data = JSON.parse(body);
    const name = data.formSender.split(' ').join('');
    console.log(data.formSender);
    if (data.formSender.length === 0 || data.formEmail.length === 0) {
      res.send('noinput');
    } else if (
      validator.isEmail(data.formEmail) &&
      validator.isAlpha(name, ['en-GB'])
    ) {
      getUserAlreadyExists(data.formSender.toLowerCase(), data.formEmail)
        .then(exists => {
          res.send(exists);
        })
        .catch(next);
    } else if (
      !validator.isEmail(data.formEmail) &&
      validator.isAlpha(name, ['en-GB'])
    ) {
      console.log('This isnt a correct email!?');
      res.send('email');
    } else if (
      validator.isEmail(data.formEmail) &&
      !validator.isAlpha(name, ['en-GB'])
    ) {
      console.log('This isnt a correct name!?');
      res.send('name');
    } else {
      console.log('Both name and email are wrong!!!');
      res.send('emailname');
    }
  });
});

module.exports = router;
