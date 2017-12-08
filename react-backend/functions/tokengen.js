const crypto = require('crypto');

module.exports = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(20, (err, buf) => {
      if (err) throw err;
      resolve(buf.toString('hex'));
    });
  });
};
