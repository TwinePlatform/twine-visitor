/*
 * Configuration object schema
 *
 * Specifies the required shape and content of the configuration object.
 */
const Joi = require('joi');
const { DEVELOPMENT, TESTING, PRODUCTION } = require('./environments');

module.exports = {
  root: Joi.string().min(1).required(),
  env: Joi.string().only(DEVELOPMENT, TESTING, PRODUCTION),
  web: Joi.object({
    host: Joi.string().min(1),
    port: Joi.number().min(0).max(65535).required(),
    tls: Joi.alternatives().try(
      Joi.only(null),
      Joi.object({
        key: Joi.string().required(),
        cert: Joi.string().required(),
      }),
    ),
  }),
  psql: Joi.object({
    host: Joi.string().min(1).required(),
    port: Joi.number().min(0).max(65535).required(),
    database: Joi.string().min(1).replace(/^\//, '').required(),
    user: Joi.string().min(1).required(),
    password: Joi.string(),
    ssl: Joi.bool().default(false),
  }),
  email: Joi.object({
    postmark_key: Joi.string().required(),
  }),
  session: Joi.object({
    standard_jwt_secret: Joi.string().min(20).required(),
    cb_admin_jwt_secret: Joi.string().min(20).required(),
    hmac_secret: Joi.string().min(20).required(),
    ttl: Joi.number().integer().min(0).max(3e10), // milliseconds
  }),
  validation: Joi.object({
    options: Joi.object(),
  }),
  client: Joi.object({
    api_host_domain: Joi.string().uri().required(),
  }),
};
