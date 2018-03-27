const router = require('express').Router();
const Joi = require('joi');
const Boom = require('boom');
const pwdChange = require('../../database/queries/cb/pwd_change');
const hash = require('../../functions/cbhash');
const checkExpire = require('../../functions/checkExpire');
const checkExists = require('../../functions/checkExists');
const { validate } = require('../../shared/middleware');


const schemas = {
  body: {
    token: Joi.string().required(),

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
  const { password, token } = req.body;
  const secret = req.app.get('cfg').session.hmac_secret;
  const pgClient = req.app.get('client:psql');

  try {
    const exists = await checkExists(pgClient, token);
    const notExpired = await checkExpire(pgClient, token);

    if (!exists) {
      return next(Boom.unauthorized('Token not recognised'));
    }

    if (!notExpired) {
      return next(Boom.unauthorized('Token expired'));
    }

    await pwdChange(pgClient, hash(secret, password), token);

    res.send({ result: null });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
