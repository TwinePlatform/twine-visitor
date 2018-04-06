const router = require('express').Router();
const userRegister = require('../database/queries/user_register');
const Joi = require('joi');
const { validate } = require('../shared/middleware');
const qrcodemaker = require('../functions/qrcodemaker');
const hash = require('../functions/hash');
const sendQrCode = require('../functions/qr_send');
const userCheckExists = require('../database/queries/user_check_exists');
const Boom = require('boom');

const schema = {
  body: {
    formSender: Joi.string().required(),
    formPhone: Joi.string().allow(),
    formGender: Joi.string().required(),
    formYear: Joi.number()
      .integer()
      .min(new Date().getFullYear() - 113)
      .max(new Date().getFullYear())
      .required(),
    formEmail: Joi.string()
      .email()
      .required(),
    formEmailContact: Joi.bool().required(),
    formSmsContact: Joi.bool().required(),
  },
};

router.post('/', validate(schema), async (req, res, next) => {
  const pmClient = req.app.get('client:postmark');
  const pgClient = req.app.get('client:psql');
  const secret = req.app.get('cfg').session.hmac_secret;
  const {
    formSender,
    formPhone,
    formGender,
    formYear,
    formEmail,
    formEmailContact,
    formSmsContact,
  } = req.body;
  const hashString = hash(secret, req.body);
  const name = formSender.toLowerCase();

  try {

    const exists = await userCheckExists(pgClient, name, formEmail);

    if (exists) {
      return next(Boom.conflict('User already registered'));
    }

    await userRegister(
      pgClient,
      req.auth.cb_id,
      name,
      formGender,
      formPhone,
      formYear,
      formEmail,
      hashString,
      formEmailContact,
      formSmsContact
    );
    await sendQrCode(pmClient, formEmail, formSender, hashString, req.auth.cb_logo);    
    const qr = await qrcodemaker(hashString);
    return res.send({ qr, cb_logo: req.auth.cb_logo });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
