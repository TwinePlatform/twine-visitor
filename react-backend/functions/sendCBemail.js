const postmark = require('postmark');
require('env2')('./config.env');

if (!process.env.POSTMARK_SERVER) {
  throw new Error('Environment variable POSTMARK_SERVER must be set');
}

const client = new postmark.Client(process.env.POSTMARK_SERVER);

module.exports = (email, name) => {
  console.log('hello, i am in sendCBemail');
  const messages = [
    {
      From: 'visitorapp@powertochange.org.uk',
      TemplateId: 4010082,
      To: email,
      TemplateModel: {
        name,
      },
    },
    {
      From: 'visitorapp@powertochange.org.uk',
      TemplateId: 4010082,
      To: 'visitorapp@powertochange.org.uk',
      TemplateModel: {
        email,
        name,
      },
    },
  ];
  client.sendEmailBatch(messages, (error, result) => {
    if (error) {
      console.error('Unable to send via postmark: ', error);
      return;
    }
    console.info('Sent to postmark for delivery', result);
  });
};
