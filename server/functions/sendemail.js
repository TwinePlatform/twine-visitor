module.exports = (client, visitorEmail, cbEmail, name, organisation, pdf) => {
  const messages = [
    {
      From: 'visitorapp@powertochange.org.uk',
      TemplateId: 3843402,
      To: visitorEmail,
      TemplateModel: {
        name,
        organisation,
      },
      Attachments: [
        {
          Name: `${name}-QrCode.pdf`,
          Content: pdf,
          ContentType: 'application/octet-stream',
        },
      ],
    },
    {
      From: 'visitorapp@powertochange.org.uk',
      TemplateId: 3853062,
      To: cbEmail,
      TemplateModel: {
        email: visitorEmail,
        name,
      },
      Attachments: [
        {
          Name: 'qrcode.pdf',
          Content: pdf,
          ContentType: 'application/octet-stream',
        },
      ],
    },
  ];
  return client.sendEmailBatch(messages, (error, result) => {
    if (error) {
      console.error('Unable to send via postmark: ', error);
      return;
    }
    console.info('Sent to postmark for delivery', result);
  });
};
