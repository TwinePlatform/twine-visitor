const router = require('express').Router();
const pwdChange = require('../../database/queries/cb/pwd_change');
const hash = require('../../functions/cbhash');
const checkExpire = require('../../functions/checkExpire');
const checkExists = require('../../functions/checkExists');
const { checkHasLength } = require('../../functions/helpers');

const strongPassword = new RegExp(
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
);

router.post('/', (req, res, next) => {
  const { formPswd, formPswdConfirm, token } = req.body;
  const secret = req.app.get('cfg').session.hmac_secret;

  Promise.all([checkExists(token), checkExpire(token)])
    .then(([exists, notExpired]) => {
      const hasInput = checkHasLength([formPswd, formPswdConfirm, token]);
      const pwdsMatch = formPswd === formPswdConfirm;
      const strongPwd = strongPassword.test(formPswd);

      const validationError =
        (!hasInput && 'noinput') ||
        (!exists && 'tokenmatch') ||
        (!notExpired && 'tokenexpired') ||
        (!pwdsMatch && 'pswdmatch') ||
        (!strongPwd && 'pswdweak') ||
        null;

      if (validationError) return res.status(400).send(validationError);

      const password = hash(secret, formPswd);
      pwdChange(password, token)
        .then(() => {
          res.send(true);
        })
        .catch(next);
    })
    .catch(next);
});

module.exports = router;
