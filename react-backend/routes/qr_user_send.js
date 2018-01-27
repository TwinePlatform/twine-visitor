const router = require('express').Router();
const qrCodeMaker = require('../functions/qrcodemaker');
const generatePdf = require('../functions/pdfgenerator');
const sendEmail = require('../functions/sendemail');

router.post('/', (req, res, next) => {
  qrCodeMaker(req.body.hash)
    .then(generatePdf)
    .then(pdf => sendEmail(req.body.email, req.body.name, pdf))
    .then(() => res.send({ token: req.auth.adminToken, success: true }))
    .catch(next);
});

module.exports = router;
