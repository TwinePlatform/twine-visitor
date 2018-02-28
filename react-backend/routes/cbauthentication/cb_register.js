const router = require('express').Router();
const hashCB = require('../../functions/cbhash');
const cbAdd = require('../../database/queries/cb/cb_add');
const sendCBemail = require('../../functions/sendCBemail');

router.post('/', (req, res, next) => {
  const { formPswd, formName, formEmail, formGenre } = req.body;
  const pmClient = req.app.get('client:postmark');
  const secret = req.app.get('cfg').session.hmac_secret;

  const hashedPassword = hashCB(secret, formPswd);
  const name = formName.toLowerCase();

  cbAdd(name, formEmail, formGenre, hashedPassword)
    .then(() => sendCBemail(pmClient, formEmail, formName))
    .then(() => res.send({ success: true }))
    .catch(next);
});

module.exports = router;
