const crypto = require('crypto');

module.exports = () =>
  new Promise((resolve, reject) => {
    crypto.randomBytes(20, (err, buf) => {
      if (err) return reject(err);
      resolve(buf.toString('hex'));
    });
  });
