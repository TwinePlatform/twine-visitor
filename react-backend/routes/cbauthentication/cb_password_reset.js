const validator = require('validator');
const getCBAlreadyExists = require('../../database/queries/getCBAlreadyExists');
const express = require('express');
const resetTokenGen = require('../../functions/tokengen');
const putToken = require('../../database/queries/CBqueries/putTokenData');
const sendResetEmail = require('../../functions/sendResetEmail');

const router = express.Router();

router.post('/', (req, res, next) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });

  const tokenExpire = Date.now() + 3600000;

  req.on('end', () => {
    const data = JSON.parse(body);
    if (data.formEmail.length === 0) {
      res.send('noinput');
    } else if (!validator.isEmail(data.formEmail)) {
      res.send('email');
    } else {
      getCBAlreadyExists(data.formEmail)
        .then(exists => {
          res.send(exists);

          if (exists) {
            resetTokenGen()
              .then(token => {
                putToken(token, tokenExpire, data.formEmail);
                return token;
              })
              .then(token => {
                sendResetEmail(data.formEmail, token);
              })
              .catch(err => {
                console.log('Error sending token: ', err);
              });
          }
        })
        .catch(next);
    }
  });
});

module.exports = router;
