const QrCode = require('qrcode');

module.exports = (string) => new Promise(function(resolve, reject) {
  console.log("Im running");
  QrCode.toDataURL(string, {
    errorCorrectionLevel: 'H'
  }, function(err, url) {
    if (err) {
      return reject(err)
    }
    resolve(url);
  })
});
