const router = require('express').Router();
const validator = require('validator');
const userCheckExists = require('../database/queries/user_check_exists');
const { checkHasLength } = require('../functions/helpers');

router.post('/', (req, res, next) => {
  const { formSender, formEmail, formPhone, formGender, formYear } = req.body;
  const name = formSender.split(' ').join('');
  const pgClient = req.app.get('client:psql');

  const noInput =
    (!checkHasLength([formSender, formEmail, formGender, formYear]) &&
      'noinput') ||
    '';
  const notEmail = (!validator.isEmail(formEmail) && 'email') || '';
  const notPhone =
    (!validator.isMobilePhone(formPhone, 'en-GB') &&
      formPhone !== '' &&
      'phone') ||
    '';
  const notEnglishName = (!validator.isAlpha(name) && 'name') || '';

  const validationError = noInput || notEmail + notEnglishName || notPhone;

  if (validationError) return res.status(400).send(validationError);

  userCheckExists(pgClient, formSender.toLowerCase(), formEmail)
    .then(
      exists =>
        exists ? res.status(400).send(exists) : res.status(200).send(exists)
    )
    .catch(next);
});

module.exports = router;
