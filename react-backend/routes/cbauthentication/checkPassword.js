const express = require('express');

const router = express.Router();
const putNewPassword = require('../../database/queries/CBqueries/putNewPassword');
const hash = require('../../functions/cbhash');
const checkExpire = require('../../database/queries/CBqueries/checkExpire');
const checkExists = require('../../database/queries/CBqueries/checkToken');

const strongPassword = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})');

router.post('/', (req, res, next) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    const data = JSON.parse(body);
    console.log(data);

    if (
      data.formPswd.length === 0 ||
      data.formPswdConfirm.length === 0 ||
      data.token.length === 0
    ) {
      res.send('noinput');
    } else {
      Promise.all([checkExists(data.token), checkExpire(data.token)])
        .then((result) => {
          if (!result[0]) {
            console.log('Token does not match');
            res.send('tokenmatch');
          } else if (!result[1]) {
            console.log('Token has expired');
            res.send('tokenexpired');
          } else if (data.formPswd !== data.formPswdConfirm) {
            console.log("Passwords don't match");
            res.send('pswdmatch');
          } else if (strongPassword.test(data.formPswd) === false) {
            console.log('Password is weak');
            res.send('pswdweak');
          } else {
            console.log('password put incoming');
            const password = hash(data.formPswd);
            console.log(password);
            putNewPassword(password, data.token)
              .then(() => {
                res.send(true);
              })
              .catch((error) => {
                console.log('error from putNewPassword ', error);
                res.status(500).send(error)
              })
          }
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    }
  });
});

module.exports = router;
