module.exports = (client, email, name) => {
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
      TemplateId: 4251043,
      To: 'visitorapp@powertochange.org.uk',
      TemplateModel: {
        email,
        name,
      },
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
