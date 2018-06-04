const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const Boom = require('boom');
const jwt = require('jsonwebtoken');
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
  const cbAdminJwtSecret = req.app.get('cfg').session.cb_admin_jwt_secret;

  try {
    const result = await pgClient.query('SELECT hash_pwd FROM cbusiness WHERE email=$1', [req.auth.cb_email]);
    if (!result.rowCount) {
      return next(Boom.unauthorized('Unrecognised user'));
    }

    const matches = await bcrypt.compare(password, result.rows[0].hash_pwd);
    if (!matches) {
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
