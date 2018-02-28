const router = require('express').Router();
const qrCodeMaker = require('../functions/qrcodemaker');
const generatePdf = require('../functions/pdfgenerator');
const sendEmail = require('../functions/sendemail');

router.post('/', (req, res, next) => {
  const pmClient = req.app.get('client:postmark');

  qrCodeMaker(req.body.hash)
    .then(QRcodeBase64Url => generatePdf(QRcodeBase64Url, req.auth.cb_logo))
    .then(pdf => sendEmail(pmClient, req.body.email, req.body.name, pdf))
    .then(() => res.send({ success: true }))
    .catch(next);
});

module.exports = router;
