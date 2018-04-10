const router = require('express').Router();
const Joi = require('joi');
const Boom = require('boom');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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
  const standardJwtSecret = req.app.get('cfg').session.standard_jwt_secret;

  try {
    const result = await pgClient.query('SELECT hash_pwd FROM cbusiness WHERE email=$1', [email]);
    if (!result.rowCount) {
      return next(Boom.unauthorized('Credentials not recognised'));
    }

    const matches = await bcrypt.compare(password, result.rows[0].hash_pwd);
    if (!matches) {
      return next(Boom.unauthorized('Credentials not recognised'));
    }

    const token = jwt.sign({ email }, standardJwtSecret);
    res.send({ result: { token } });

  } catch (error) {
    return next(error);
  }

});

module.exports = router;
