const QrCode = require('qrcode');

module.exports = (string) => {
  QrCode.toDataURL(string, {errorCorrectionLevel: 'H'}, function(err, url) {
    return url;
  })
};
