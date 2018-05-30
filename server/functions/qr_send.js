const qrCodeMaker = require('../functions/qrcodemaker');
const generatePdf = require('../functions/pdfgenerator');
const sendemail = require('../functions/sendemail');

const sendQrCode = (client, visitorEmail, cbEmail, name, hash, cbName, cbLogo) => {
  if (!visitorEmail) return console.log('Missing the person to deliver this email to');

  qrCodeMaker(hash)
    .then(QRcodeBase64Url => generatePdf(QRcodeBase64Url, cbLogo))
    .then(pdf => sendemail(client, visitorEmail, cbEmail, name, cbName, pdf))
    .catch(err => {
      console.log('Failed to send email ', err);
    });
};

module.exports = sendQrCode;
