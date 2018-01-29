const router = require('express').Router();
const validator = require('validator');
const cbCheckExists = require('../../database/queries/cb/cb_check_exists');
const { checkHasLength } = require('../../functions/helpers');

const strongPassword = new RegExp(
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
);

router.post('/', (req, res, next) => {
  const {
    formName,
    formEmail,
    formGenre,
    formPswd,
    formPswdConfirm,
  } = req.body;
  const orgName = formName.split(' ').join('');

  const notEmail = !validator.isEmail(formEmail);
  const notLatinName = !validator.isAlpha(orgName, ['en-GB']);
  const emptyInput = !checkHasLength([
    formName,
    formEmail,
    formGenre,
    formPswd,
    formPswdConfirm,
  ]);
  const pwdWeak = !strongPassword.test(formPswd);
  const pwdMatch = formPswd !== formPswdConfirm;

  const emailNameValid =
    ((notEmail && 'email') || '') + ((notLatinName && 'name') || '');

  const validationError =
    emailNameValid ||
    (emptyInput && 'noinput') ||
    (pwdWeak && 'pswdweak') ||
    (pwdMatch && 'pswdmatch') ||
    null;

  if (validationError) return res.send(validationError);

  cbCheckExists(formEmail)
    .then(res.send)
    .catch(next);
});

module.exports = router;
