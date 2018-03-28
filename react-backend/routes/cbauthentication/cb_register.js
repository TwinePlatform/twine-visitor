const router = require('express').Router();
const Joi = require('joi');
const Boom = require('boom');
const hashCB = require('../../functions/cbhash');
const cbAdd = require('../../database/queries/cb/cb_add');
const sendCBemail = require('../../functions/sendCBemail');
const cbCheckExists = require('../../database/queries/cb/cb_check_exists');
const { validate } = require('../../shared/middleware');


const schemas = {
  body: {
    orgName: Joi.string()
      .regex(/[^\w\s\d]+/, { name: 'alphanumeric', invert: true })
      .min(1)
      .required(),

    email: Joi.string()
      .email()
      .required(),

    category: Joi.string()
      .required(),

    password: Joi.string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, 'strong_pwd')
      .required()
      .options({ language: { string: { regex: { base: 'is too weak' } } } }),

    passwordConfirm: Joi.string()
      .only(Joi.ref('password'))
      .required()
      .options({ language: { string: { allowOnly: 'must match password' } } }),
  },
};


router.post('/', validate(schemas), async (req, res, next) => {
  // Collect data and router dependencies from request/app
  const { password, orgName, email, category } = req.body;
  const db = req.app.get('client:psql');
  const pmClient = req.app.get('client:postmark');
  const secret = req.app.get('cfg').session.hmac_secret;

  // Process registration request
  try {
    const hashedPassword = hashCB(secret, password);
    const orgNameLower = orgName.toLowerCase();
    const exists = await cbCheckExists(db, email);

    if (exists) {
      return next(Boom.conflict('Business already registered'));
    }

    await cbAdd(db, orgNameLower, email, category, hashedPassword);
    await sendCBemail(pmClient, email, orgNameLower);
    return res.send({ result: null });

  } catch (error) {
    return next(error);
  }

});

module.exports = router;
