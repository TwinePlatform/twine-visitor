const router = require('express').Router();
const validator = require('validator');
const jwt = require('jsonwebtoken');
const hashCB = require('../../functions/cbhash');
const cbLogin = require('../../database/queries/cb/cb_login');
const { checkHasLength } = require('../../functions/helpers');

router.post('/', (req, res, next) => {
  const { formEmail, formPswd } = req.body;
  const notEmail = (!validator.isEmail(formEmail) && 'noinput') || '';
  const noInput = (!checkHasLength([formEmail, formPswd]) && 'email') || '';

  const validationError = noInput || notEmail;

  if (validationError) return res.send(validationError);

  const passwordHash = hashCB(formPswd);

  cbLogin(formEmail, passwordHash)
    .then(exists => {
      const token = jwt.sign({ email: formEmail }, process.env.SECRET);
      const loggedIn = exists ? { success: true, token } : { success: false };

      res.send(loggedIn);
    })
    .catch(next);
});

module.exports = router;
