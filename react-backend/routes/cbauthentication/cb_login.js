const router = require('express').Router();
const Joi = require('joi');
const Boom = require('boom');
const jwt = require('jsonwebtoken');
const hashCB = require('../../functions/cbhash');
const cbLogin = require('../../database/queries/cb/cb_login');
const { validate } = require('../../shared/middleware');


const schemas = {
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().min(1).required(),
  },
};


router.post('/', validate(schemas), async (req, res, next) => {
  const { email, password } = req.body;
  const pgClient = req.app.get('client:psql');
  const secret = req.app.get('cfg').session.hmac_secret;
  const standardJwtSecret = req.app.get('cfg').session.standard_jwt_secret;

  const passwordHash = hashCB(secret, password);

  try {
    const exists = await cbLogin(pgClient, email, passwordHash);

    if (! exists) {
      return next(Boom.unauthorized('Credentials not recognised'));
    }

    const token = jwt.sign({ email }, standardJwtSecret);
    res.send({ result: { token } });

  } catch (error) {
    return next(error);
  }

});

module.exports = router;
