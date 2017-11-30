const crypto = require('crypto');
require('env2')('./config.env');

if (!process.env.SECRET) throw new Error('Environment variable SECRET must be set');
const secret = process.env.SECRET;

module.exports = (pswd) => {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(pswd)
    .digest('hex');
  return hash;
};

// {"formSender":"no name entered","formEmail":"no@email.com","formSex":"male","formYear":1980}
