const express = require('express');

const router = express.Router();
const putNewPassword = require('../../database/queries/CBqueries/putNewPassword');
const hash = require('../../functions/cbhash');
const checkExpire = require('../../functions/checkExpire');
const checkExists = require('../../functions/checkExists');

const strongPassword = new RegExp(
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
);

router.post('/', (req, res, next) => {
  let body = '';
  req.on('data', chunk => {
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
      Promise.all([checkExists(data.token), checkExpire(data.token)]).then(
        result => {
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
            putNewPassword(password, data.token, (error, result) => {
              if (error) {
                console.log('error from putNewPassword ', error);
                res.status(500).send({
                  error: 'Cannot access database to change password'
                });
              } else {
                console.log('This should redirect');
                res.send(true);
              }
            });
          }
        }
      );
    }
  });
});

module.exports = router;
