const validator = require('validator');

const express = require('express');

const router = express.Router();
const getCBAlreadyExists = require('../../database/queries/getCBAlreadyExists');

const strongPassword = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})');

router.post('/', (req, res, next) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    const data = JSON.parse(body);
    const org_name = data.formName.split(' ').join('');
    console.log(data.formName);
    if (
      data.formName.length === 0 ||
      data.formEmail.length === 0 ||
      data.formGenre.length === 0 ||
      data.formPswd.length === 0 ||
      data.formPswdConfirm.length === 0
    ) {
      res.send('noinput');
    } else if (validator.isEmail(data.formEmail) && validator.isAlpha(org_name, ['en-GB'])) {
      getCBAlreadyExists(data.formName.toLowerCase(), data.formEmail, (error, result) => {
        if (error) {
          console.log('error from getCBAlreadyExists ', error);
        } else if (result.rows[0].exists === true) {
          res.send(result.rows[0].exists);
        } else if (
          result.rows[0].exists === false &&
          strongPassword.test(data.formPswd) === false
        ) {
          console.log('Password is weak');
          res.send('pswdweak');
        } else if (result.rows[0].exists === false && data.formPswd !== data.formPswdConfirm) {
          console.log("Passwords don't match");
          res.send('pswdmatch');
        } else {
          res.send(result.rows[0].exists);
        }
        console.log(typeof result.rows[0].exists, result.rows[0].exists);
      });
    } else if (!validator.isEmail(data.formEmail) && validator.isAlpha(org_name, ['en-GB'])) {
      console.log('This isnt a correct email!?');
      res.send('email');
    } else if (validator.isEmail(data.formEmail) && !validator.isAlpha(org_name, ['en-GB'])) {
      console.log('This isnt a correct name!?');
      res.send('name');
    } else if (!validator.isEmail(data.formEmail) && !validator.isAlpha(org_name, ['en-GB'])) {
      console.log('Both name and email are wrong!!!');
      res.send('emailname');
    }
  });
});

module.exports = router;
