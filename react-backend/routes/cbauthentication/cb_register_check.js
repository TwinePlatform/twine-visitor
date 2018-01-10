const express = require('express');
const validator = require('validator');
const getCBAlreadyExists = require('../../database/queries/getCBAlreadyExists');
const { checkHasLength } = require('../../functions/helpers');

const router = express.Router();

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
    const orgName = data.formName.split(' ').join('');

    const isEmail = validator.isEmail(data.formEmail);
    const isName = validator.isAlpha(orgName, ['en-GB']);
    const emptyInput = checkHasLength([
      data.formName,
      data.formEmail,
      data.formGenre,
      data.formPswd,
      data.formPswdConfirm,
    ]);

    if (isEmail && isName) {
      getCBAlreadyExists(data.formEmail)
        .then(exists => {
          if (exists) {
            res.send(exists);
          } else if (!strongPassword.test(data.formPswd)) {
            res.send('pswdweak');
          } else if (data.formPswd !== data.formPswdConfirm) {
            res.send('pswdmatch');
          } else {
            res.send(exists);
          }
        })
        .catch(next);
    } else if (emptyInput || !isEmail || !isName) {
      const email = !isEmail ? 'email' : '';
      const isAlpha = !isName ? 'name' : '';

      res.send((emptyInput && 'noinput') || email + isAlpha);
    }
  });
});

module.exports = router;
