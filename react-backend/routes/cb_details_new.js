const router = require('express').Router();
const cbDetailsNew = require('../database/queries/cb/cb_details_new');
const { checkHasLength } = require('../functions/helpers');
const validator = require('validator');

router.post('/', (req, res, next) => {

  const notEmail = !validator.isEmail(req.body.email);
  const notLatinName = !validator.isAlphanumeric(req.body.org_name, ['en-GB']);
  const emptyInput = !checkHasLength([
    req.body.org_name,
    req.body.email,
    req.body.genre,
  ]);

  const emailNameValid =
    ((notEmail && 'email') || '') + ((notLatinName && 'name') || '');

  const validationError =
    emailNameValid ||
    (emptyInput && 'noinput') ||
    null;
console.log(validationError);
  if (validationError) return res.status(400).send(validationError);

  cbDetailsNew(
    req.app.get('client:psql'),
    req.auth.cb_id,
    req.body.org_name,
    req.body.genre,
    req.body.email,
    req.body.uploadedFileCloudinaryUrl
  )
    .then(details => res.send({ details }))
    .catch(next);
});

module.exports = router;
