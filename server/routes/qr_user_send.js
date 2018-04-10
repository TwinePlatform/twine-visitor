const router = require('express').Router();
const qrCodeMaker = require('../functions/qrcodemaker');
const generatePdf = require('../functions/pdfgenerator');
const sendEmail = require('../functions/sendemail');
const getUserDetails = require('../database/queries/user_details');

router.post('/', async (req, res, next) => {
  const pmClient = req.app.get('client:postmark');
  const pgClient = req.app.get('client:psql');

  try {
    const user = await getUserDetails(pgClient, req.auth.cb_id, req.body.id);
    const QRcodeBase64Url = await qrCodeMaker(user.hash);
    const pdf = generatePdf(QRcodeBase64Url, req.auth.cb_logo);
    await sendEmail(pmClient, req.body.email, req.body.name, pdf);

    res.send({ result: null });

  } catch (error) {
    next(error);

  }
});

module.exports = router;
