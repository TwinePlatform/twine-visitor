const postmark = require('postmark');
require('env2')('./config.env');
const QrCodeMaker = require('../functions/qrcodemaker');

const client = new postmark.Client(process.env.POSTMARK_SERVER);

if (!process.env.POSTMARK_SERVER) throw new Error('Environment variable POSTMARK_SERVER must be set');

const sendQrCode = function (email, name, hash) {
  if (!email) return console.log('Missing the person to deliver this email to');
  const newhash = QrCodeMaker(hash)
    .then((url) => {
      const qrcontent = url.slice(22);
      const messages = [
        {
          From: 'sonjaw@powertochange.org.uk',
          TemplateId: 3843402,
          To: email,
          TemplateModel: {
            name,
          },
          Attachments: [{
            Name: 'qrcode.png',
            Content: qrcontent,
            ContentType: 'image/png',
          }],
        },
        {
          From: 'sonjaw@powertochange.org.uk',
          TemplateId: 3853062,
          To: 'dev@milfordcapitalpartners.com',
          TemplateModel: {
            email,
            name,
          },
          Attachments: [{
            Name: 'qrcode.png',
            Content: qrcontent,
            ContentType: 'image/png',
          }],
        },
      ];
      client.sendEmailBatch(messages, (error, result) => {
        if (error) {
          console.error(`Unable to send via postmark: ${error.message}`);
          return;
        }
        console.info('Sent to postmark for delivery');
      },
      );
    });
};

module.exports = {
  sendQrCode,
};
