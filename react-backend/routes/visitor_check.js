const router = require('express').Router();
const validator = require('validator');
const checkUserExists = require('../database/queries/user_check_exists');
const { checkHasLength } = require('../functions/helpers');

router.post('/', (req, res, next) => {
  const { formSender, formEmail } = req.body;
  const name = formSender.split(' ').join('');

  const noInput = (!checkHasLength([formSender, formEmail]) && 'noinput') || '';
  const notEmail = (!validator.isEmail(formEmail) && 'email') || '';
  const notEnglishName = (!validator.isAlpha(name) && 'name') || '';

  const validationError = noInput || notEmail + notEnglishName;

  if (validationError) return res.send(validationError);

  checkUserExists(formSender.toLowerCase(), formEmail)
    .then(exists => {
      res.send(exists);
    })
    .catch(next);
});

module.exports = router;
