const router = require('express').Router();
const validator = require('validator');
const hashCB = require('../../functions/cbhash');
const cbAdd = require('../../database/queries/cb/cb_add');
const sendCBemail = require('../../functions/sendCBemail');
const cbCheckExists = require('../../database/queries/cb/cb_check_exists');
const { checkHasLength } = require('../../functions/helpers');

const strongPassword = new RegExp(
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
);

router.post('/', async (req, res, next) => {
  // Collect data and router dependencies from request/app
  const { formPswd, formName, formEmail, formGenre, formPswdConfirm } = req.body;
  const db = req.app.get('client:psql');
  const pmClient = req.app.get('client:postmark');
  const secret = req.app.get('cfg').session.hmac_secret;

  // Validate the request
  const orgName = formName.split(' ').join('');
  const notEmail = !validator.isEmail(formEmail);
  const notLatinName = !validator.isAlphanumeric(orgName, ['en-GB']);
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

  if (validationError) {
    return res.status(400).send({ result: null, error: true, validation: validationError });
  }

  // Process registration request
  try {
    const hashedPassword = hashCB(secret, formPswd);
    const name = formName.toLowerCase();
    const exists = await cbCheckExists(db, formEmail);

    if (!exists) {
      await cbAdd(db, name, formEmail, formGenre, hashedPassword);
      await sendCBemail(pmClient, formEmail, formName);
      return res.send({ success: true });
    }

    return res.send(exists);

  } catch (error) {
    return next(error);
  }

});

module.exports = router;
