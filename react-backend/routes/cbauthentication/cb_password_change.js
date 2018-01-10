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
      Promise.all([checkExists(data.token), checkExpire(data.token)])
        .then(([exists, notExpired]) => {
          const pwdsMatch = data.formPswd !== data.formPswdConfirm;
          const strongPwd = strongPassword.test(data.formPswd);

          if (exists && notExpired && pwdsMatch && strongPwd) {
            const password = hash(data.formPswd);

            putNewPassword(password, data.token)
              .then(() => {
                res.send(true);
              })
              .catch(next);
          } else {
            const message =
              (!exists && 'tokenmatch') ||
              (!notExpired && 'tokenexpired') ||
              (!pwdsMatch && 'pswdmatch') ||
              (!strongPwd && 'pswdweak') ||
              null;

            if (message) return res.send(message);

            next(new Error('Unkown error in password change'));
          }
        })
        .catch(next);
    }
  });
});

module.exports = router;
