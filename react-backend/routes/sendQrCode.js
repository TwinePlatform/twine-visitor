const QrCodeMaker = require('../functions/qrcodemaker');
const generatePdf = require('../functions/pdfgenerator');
const sendemail = require('../functions/sendemail');


const sendQrCode = function(email, name, hash) {
  if (!email) return console.log('Missing the person to deliver this email to');
  QrCodeMaker(hash)
    .then(generatePdf)
    .then(pdf=>sendemail(email, name, pdf))
    .catch(err => {
      console.log(err)
    })
}

module.exports = {
  sendQrCode
};
