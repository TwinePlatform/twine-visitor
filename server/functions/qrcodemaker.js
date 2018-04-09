const QrCode = require('qrcode');

module.exports = string =>
  new Promise((resolve, reject) => {
    QrCode.toDataURL(
      string,
      {
        errorCorrectionLevel: 'H',
        color: {
          dark: '#06112f',
          light: '#FFFFFF',
        },
      },
      (err, url) => {
        if (err) {
          return reject(err);
        }
        resolve(url);
      },
    );
  });
