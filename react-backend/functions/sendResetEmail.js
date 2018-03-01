module.exports = (client, email, token) => 
  client.sendEmailWithTemplate({
    From: 'visitorapp@powertochange.org.uk',
    TemplateId: 4148361,
    To: email,
    TemplateModel: {
      email,
      token,
    },
  });

