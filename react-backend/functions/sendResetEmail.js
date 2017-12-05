const postmark = require('postmark');
require('env2')('./config.env');

if (!process.env.POSTMARK_SERVER) {
  throw new Error('Environment variable POSTMARK_SERVER must be set');
}

const client = new postmark.Client(process.env.POSTMARK_SERVER);

module.exports = email => {
  console.log('Hello, I am in sendresetemail');
  const messages = [
    {
      From: 'visitorapp@powertochange.org.uk',
      TemplateId: 4010082,
      To: email,
      TemplateModel: {
        email
      }
    }
  ];

  client.sendEmailBatch(messages, (error, result) => {
    if (error) {
      console.error('Unable to send via postmark: ', error);
      return;
    }
    console.info('Sent to postmark for delivery', result);
  });
};
