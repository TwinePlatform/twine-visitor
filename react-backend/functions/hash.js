const crypto = require('crypto');

module.exports = (secret, userObject) => {
  let userString =
    userObject.formSender + userObject.formEmail + userObject.formSex + userObject.formYear;
  userString = userString.replace(/\s/g, '');

  const hash = crypto
    .createHmac('sha256', secret)
    .update(userString)
    .digest('hex');
  return hash;
};
