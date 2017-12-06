const validator = require('validator');
const getCBAlreadyExists = require('../../database/queries/getCBAlreadyExists');
const express = require('express');
const resetTokenGen = require('../../functions/tokengen');
const putToken = require('../../database/queries/CBqueries/putTokenData');
const sendResetEmail = require('../../functions/sendResetEmail');

const router = express.Router();

const tokenExpire = Date.now() + 3600000;

router.post('/', (req, res, next) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', () => {
    const data = JSON.parse(body);
    if (data.formEmail.length === 0) {
      res.send('noinput');
    } else if (validator.isEmail(data.formEmail)) {
      getCBAlreadyExists(data.formEmail, (error, result) => {
        if (error) {
          console.log('error from getCBAlreadyExists ', error);
          res.status(500).send({
            error: 'Cannot access database to check if cbemail exists'
          });
        } else {
          res.send(result.rows[0].exists);
          if (result.rows[0].exists) {
            resetTokenGen().then(token => {
              putToken(token, tokenExpire, data.formEmail, err => {
                if (err) throw err;
                console.log(token);
                sendResetEmail(data.formEmail, token);
              });
            });
          }
        }
      });
    } else if (!validator.isEmail(data.formEmail)) {
      console.log('This isnt a correct email!?');
      res.send('email');
    }
  });
});

module.exports = router;
