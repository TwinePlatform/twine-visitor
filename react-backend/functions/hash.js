const crypto = require('crypto');
require('env2')('./config.env');

if (!process.env.SECRET) throw new Error('Environment variable SECRET must be set');
const secret = process.env.SECRET;

module.exports = (userObject) => {
  let userString =
    userObject.formSender + userObject.formEmail + userObject.formSex + userObject.formYear;
  userString = userString.replace(/\s/g, '');

  const hash = crypto
    .createHmac('sha256', secret)
    .update(userString)
    .digest('hex');
  return hash;
};
