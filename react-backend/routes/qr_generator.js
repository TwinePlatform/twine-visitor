const express = require('express');
const putUserData = require('../database/queries/putFormData');
const qrcodemaker = require('../functions/qrcodemaker');
const hash = require('../functions/hash');
const sendQrCode = require('./qr_send');

const router = express.Router();

router.post('/', (req, res, next) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', () => {
    const details = JSON.parse(body);
    const hashString = hash(details);
    const name = details.formSender.toLowerCase();

    putUserData(
      req.auth.cb_id,
      name,
      details.formSex,
      details.formYear,
      details.formEmail,
      hashString
    )
      .then(() => {
        sendQrCode(details.formEmail, details.formSender, hashString);
        return hashString;
      })
      .then(qrcodemaker)
      .then(qr => res.send(qr))
      .catch(next);
  });
});

module.exports = router;
