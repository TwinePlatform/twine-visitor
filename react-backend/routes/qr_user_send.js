const express = require('express');
const qrCodeMaker = require('../functions/qrcodemaker');
const generatePdf = require('../functions/pdfgenerator');
const sendEmail = require('../functions/sendemail');
const getCBLoginDetailsValid = require('../database/queries/getCBlogindetailsvalid');
const hashCB = require('../functions/cbhash');

const router = express.Router();

router.post('/', (req, res, next) => {
  const hashedPassword = hashCB(req.body.password);
  getCBLoginDetailsValid(req.auth.cb_email, hashedPassword)
    .then(exists => {
      if (!exists) throw new Error('Incorrect password');
    })
    .then(() => qrCodeMaker(req.body.hash))
    .then(QRcodeBase64Url => generatePdf(QRcodeBase64Url, req.auth.cb_logo))
    .then(pdf => sendEmail(req.body.email, req.body.name, pdf))
    .then(() => res.send({ success: true }))
    .catch(err => {
      if (err.message !== 'Incorrect password') return next(err);
      res.send({
        success: false,
        reason: 'incorrect password',
      });
    });
});

module.exports = router;
