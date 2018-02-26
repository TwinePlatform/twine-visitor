const router = require('express').Router();
const validator = require('validator');
const jwt = require('jsonwebtoken');
const hashCB = require('../../functions/cbhash');
const cbLogin = require('../../database/queries/cb/cb_login');
const { checkHasLength } = require('../../functions/helpers');

router.post('/', (req, res, next) => {
  const { formEmail, formPswd } = req.body;

  const notEmail = (!validator.isEmail(formEmail) && 'email') || '';
  const noInput = (!checkHasLength([formEmail, formPswd]) && 'noinput') || '';

  const validationError = noInput || notEmail;
  if (validationError) return res.send({ reason: validationError });

  const passwordHash = hashCB(formPswd);

  cbLogin(formEmail, passwordHash)
    .then((exists) => {
      if (exists) {
        const token = jwt.sign({ email: formEmail }, process.env.SECRET);
        const loggedInResponse = { success: true, token };
        res.send(loggedInResponse);
      } else {
        const errorResponse = { success: false };
        res.status(401).send(errorResponse);
      }
    })
    .catch(next);
});

module.exports = router;
