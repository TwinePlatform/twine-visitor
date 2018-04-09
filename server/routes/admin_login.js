const express = require('express');
const Joi = require('joi');
const Boom = require('boom');
const jwt = require('jsonwebtoken');
const hashCB = require('../functions/cbhash');
const cbLogin = require('../database/queries/cb/cb_login');
const { validate } = require('../shared/middleware');


const router = express.Router();
const schemas = {
  body: {
    password: Joi.string().min(1).required(),
  },
};


router.post('/', validate(schemas), async (req, res, next) => {
  const { password } = req.body;
  const pgClient = req.app.get('client:psql');
  const secret = req.app.get('cfg').session.hmac_secret;
  const cbAdminJwtSecret = req.app.get('cfg').session.cb_admin_jwt_secret;
  const hashedPassword = hashCB(secret, password);

  try {
    const exists = await cbLogin(pgClient, req.auth.cb_email, hashedPassword);

    if (! exists) {
      return next(Boom.unauthorized('Incorrect password'));
    }

    const token = jwt.sign(
      { email: req.auth.cb_email, admin: true },
      cbAdminJwtSecret,
      { expiresIn: '5m' }
    );

    return res.send({ result: { token } });

  } catch (error) {
    return next(error);

  }
});

module.exports = router;
