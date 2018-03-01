const router = require('express').Router();
const validator = require('validator');
const userCheckExists = require('../database/queries/user_check_exists');
const { checkHasLength } = require('../functions/helpers');

router.post('/', (req, res, next) => {
  const { formSender, formEmail } = req.body;
  const name = formSender.split(' ').join('');
  const pgClient = req.app.get('client:psql');

  const noInput = (!checkHasLength([formSender, formEmail]) && 'noinput') || '';
  const notEmail = (!validator.isEmail(formEmail) && 'email') || '';
  const notEnglishName = (!validator.isAlpha(name) && 'name') || '';

  const validationError = noInput || notEmail + notEnglishName;

  if (validationError) return res.status(400).send(validationError);

  userCheckExists(pgClient, formSender.toLowerCase(), formEmail)
    .then(exists => (exists ? res.send(exists) : res.status(400).send(exists)))
    .catch(next);
});

module.exports = router;
