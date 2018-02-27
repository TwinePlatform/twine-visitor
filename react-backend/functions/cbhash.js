const crypto = require('crypto');

module.exports = (secret, pswd) => {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(pswd)
    .digest('hex');
  return hash;
};
