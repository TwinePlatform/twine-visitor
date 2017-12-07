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

    // let tokenExists = false;
    // checkToken(data.token, (error, result) => {
    //   if (error) {
    //     console.log('error from checkToken ', error);
    //     throw error;
    //   } else {
    //     tokenExists = result.rows[0].exists;
    //     console.log(typeof tokenExists, tokenExists);
    //   }
    // });

    // let tokenExpire = false;
    // checkExpire(data.token, (error, result) => {
    //   if (error) {
    //     console.log('error from checkExpire ', error);
    //     throw error;
    //   } else {
    //     tokenExpire = result.rows[0].exists;
    //     console.log(typeof tokenExpire, tokenExpire);
    //   }
    // });

    if (
      data.formPswd.length === 0 ||
      data.formPswdConfirm.length === 0 ||
      data.token.length === 0
    ) {
      res.send('noinput');
    } else if (data.formPswd !== data.formPswdConfirm) {
      console.log("Passwords don't match");
      res.send('pswdmatch');
    } else if (strongPassword.test(data.formPswd) === false) {
      console.log('Password is weak');
      res.send('pswdweak');
    } else if (!checkExists(data.token)) {
      console.log('Token does not match');
      // console.log(typeof tokenExists, tokenExists);
      res.send('tokenmatch');
    } else if (!checkExpire(data.token)) {
      console.log('Token has expired');
      // console.log(typeof tokenExpire, tokenExpire);
      res.send('tokenexpired');
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
          res.send(true);
        }
      });
    }
  });
});

module.exports = router;
