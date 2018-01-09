const validator = require('validator');

const express = require('express');

const jwt = require('jsonwebtoken');

const router = express.Router();
const getUserAlreadyExists = require('../database/queries/getUserAlreadyExists');

router.post('/', (req, res, next) => {
  jwt.verify(req.headers.authorization, process.env.SECRET, (err, payload) => {
    if (err) {
      console.log(err);
      res.send(JSON.stringify({ error: 'Not logged in' }));
    } else {
      const data = req.body;
      const name = data.formSender.split(' ').join('');
      console.log(data.formSender);
      if (data.formSender.length === 0 || data.formEmail.length === 0) {
        res.send('noinput');
      } else if (
        validator.isEmail(data.formEmail) &&
        validator.isAlpha(name, ['en-GB'])
      ) {
        getUserAlreadyExists(
          data.formSender.toLowerCase(),
          data.formEmail,
          (error, result) => {
            if (error) {
              console.log('error from getUserAlreadyExists ', error);
              res.status(500).send(error);
            } else {
              res.send(result.rows[0].exists);
            }
          },
        );
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
    }
  });
});

module.exports = router;
