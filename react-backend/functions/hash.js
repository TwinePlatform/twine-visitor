const crypto = require('crypto');
require('env2')('./config.env');

if (!process.env.SECRET) throw new Error('Environment variable SECRET must be set');
const secret = process.env.SECRET


module.exports = (userObject) => {
  let userString = userObject.formSender + userObject.formEmail + userObject.formSex + userObject.formYear;
  userString = userString.replace(/\s/g, '');
  console.log('userString ', userString);

  const hash = crypto.createHmac('sha256', secret)
    .update(userString)
    .digest('hex');

  return Promise.resolve(hash);
}


//{"formSender":"no name entered","formEmail":"no@email.com","formSex":"male","formYear":1980}
