const validator = require('validator');

const express = require('express');

const router = express.Router();
const getCBAlreadyExists = require('../../database/queries/getCBAlreadyExists');

router.post('/', (req, res, next) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    const data = JSON.parse(body);
    const org_name = data.formName.split(' ').join('');
    console.log(data.formName);
    if (data.formName.length === 0 || data.formEmail.length === 0 || data.formGenre.length === 0) {
      res.send('noinput');
    } else if (validator.isEmail(data.formEmail) && validator.isAlpha(org_name, ['en-GB'])) {
      getCBAlreadyExists(data.formName.toLowerCase(), data.formEmail, (error, result) => {
        if (error) {
          console.log('error from getCBAlreadyExists ', error);
        } else {
          res.send(result.rows[0].exists);
        }
      });
    } else if (!validator.isEmail(data.formEmail) && validator.isAlpha(org_name, ['en-GB'])) {
      console.log('This isnt a correct email!?');
      res.send('email');
    } else if (validator.isEmail(data.formEmail) && !validator.isAlpha(org_name, ['en-GB'])) {
      console.log('This isnt a correct name!?');
      res.send('name');
    } else {
      console.log('Both name and email are wrong!!!');
      res.send('emailname');
    }
  });
});

module.exports = router;
