const express = require('express');
const hashCB = require('../functions/cbhash');
const qrCodeMaker = require('../functions/qrcodemaker');
const getCBLoginDetailsValid = require('../database/queries/getCBlogindetailsvalid');

const router = express.Router();

router.post('/', (req, res, next) => {
  console.log('I am req.auth: ', req.auth);
  const hashedPassword = hashCB(req.body.password);
  getCBLoginDetailsValid(req.auth.cb_email, hashedPassword)
    .then(exists => {
      if (!exists) throw new Error('Incorrect password');
    })
    .then(() => qrCodeMaker(req.body.hash))
    .then(qr => res.send({ success: true, qr, cb_logo: req.auth.cb_logo }))
    .catch(err => {
      if (err.message !== 'Incorrect password') return next(err);
      res.send({
        success: false,
        reason: 'incorrect password',
      });
    });
});

module.exports = router;
