const router = require('express').Router();
const userRegister = require('../database/queries/user_register');
const qrcodemaker = require('../functions/qrcodemaker');
const hash = require('../functions/hash');
const sendQrCode = require('../functions/qr_send');

router.post('/', (req, res, next) => {
  const pmClient = req.app.get('client:postmark');
  const pgClient = req.app.get('client:psql');
  const secret = req.app.get('cfg').session.hmac_secret;
  const { formSender, formPhone, formGender, formYear, formEmail, formEmailContact, formSmsContact } = req.body;
  const hashString = hash(secret, req.body);
  const name = formSender.toLowerCase();
  
  userRegister(
    pgClient,
    req.auth.cb_id,
    name,
    formGender,
    formPhone,
    formYear,
    formEmail,
    hashString,
    formEmailContact,
    formSmsContact,
  )
  .then(() => {
    sendQrCode(pmClient, formEmail, formSender, hashString, req.auth.cb_logo);
    return hashString;
  })
  .then(qrcodemaker)
  .then(qr => res.send({ qr, cb_logo: req.auth.cb_logo }))
  .catch(next);
});

module.exports = router;
