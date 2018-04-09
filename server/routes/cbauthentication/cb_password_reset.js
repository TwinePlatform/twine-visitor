const router = require('express').Router();
const Joi = require('joi');
const Boom = require('boom');
const cbCheckExists = require('../../database/queries/cb/cb_check_exists');
const resetTokenGen = require('../../functions/tokengen');
const pwdTokenAdd = require('../../database/queries/cb/pwd_token_add');
const sendResetEmail = require('../../functions/sendResetEmail');
const { validate } = require('../../shared/middleware');


const schemas = {
  body: {
    email: Joi.string().email().required(),
  },
};

const TTL_TOKEN = 1000 * 60 * 60 * 1; // 1 hour

router.post('/', validate(schemas), async (req, res, next) => {
  const { email } = req.body;
  const pgClient = req.app.get('client:psql');
  const pmClient = req.app.get('client:postmark');
  const tokenExpire = Date.now() + TTL_TOKEN;

  try {
    const exists = await cbCheckExists(pgClient, email);

    if (! exists) {
      return next(Boom.unauthorized('Email not recognised'));
    }

    const token = await resetTokenGen();
    const pAddToken = pwdTokenAdd(pgClient, token, tokenExpire, email);
    const pSendMail = sendResetEmail(pmClient, email, token);

    await Promise.all([pAddToken, pSendMail]);
    return res.send({ result: null });

  } catch (error) {
    return next(error);
  }
});

module.exports = router;
