const router = require('express').Router();
const userRegister = require('../database/queries/user_register');
const qrcodemaker = require('../functions/qrcodemaker');
const hash = require('../functions/hash');
const sendQrCode = require('../functions/qr_send');

router.post('/', (req, res, next) => {
  const { formSender, formSex, formYear, formEmail } = req.body;
  const hashString = hash(req.body);
  const name = formSender.toLowerCase();

  userRegister(req.auth.cb_id, name, formSex, formYear, formEmail, hashString)
    .then(() => {
      sendQrCode(formEmail, formSender, hashString, req.auth.cb_logo);
      return hashString;
    })
    .then(qrcodemaker)
    .then(qr => res.send({ qr, cb_logo: req.auth.cb_logo }))
    .catch(next);
});

module.exports = router;
