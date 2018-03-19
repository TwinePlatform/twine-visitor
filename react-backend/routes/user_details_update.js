const router = require('express').Router();
const userUpdate = require('../database/queries/user_details_update');
const validator = require('validator');
const { checkHasLength } = require('../functions/helpers');

router.post('/', (req, res, next) => {

  const notEmail = !validator.isEmail(req.body.email);
  const notLatinName = !validator.isAlpha(req.body.userFullName, ['en-GB']);
  const emptyInput = !checkHasLength([
    req.body.userFullName,
    req.body.email,
    req.body.sex,
    req.body.yearOfBirth,
  ]);

  const emailNameValid =
    ((notEmail && 'email') || '') + ((notLatinName && 'name') || '');

  const validationError =
    emailNameValid ||
    (emptyInput && 'noinput') ||
    null;

  if (validationError) return res.status(400).send(validationError);

  userUpdate(
    req.app.get('client:psql'),
    req.auth.cb_id,
    req.body.userId,
    req.body.userFullName,
    req.body.sex,
    req.body.yearOfBirth,
    req.body.email
  )
    .then(details => res.send({ details }))
    .catch(next);
});

module.exports = router;
