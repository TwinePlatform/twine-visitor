const postmark = require('postmark');
require('env2')('./config.env');

if (!process.env.POSTMARK_SERVER) {
  throw new Error('Environment variable POSTMARK_SERVER must be set');
}

const client = new postmark.Client(process.env.POSTMARK_SERVER);

module.exports = (email, token) => {
  client.sendEmailWithTemplate({
    From: 'visitorapp@powertochange.org.uk',
    TemplateId: 4148361,
    To: email,
    TemplateModel: {
      email,
      token,
    },
  });
};
