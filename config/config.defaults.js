/*
 * Configuration defaults
 *
 * Can also hold non-secret, environment-invariant configuration
 * Merged into environment-specific configurations
 */
const path = require('path');
const { DEVELOPMENT } = require('./environments');


module.exports = {
  root: path.resolve(__dirname, '..'),
  env: DEVELOPMENT,
  web: {
    host: 'localhost',
    port: 1000,
    tls: null,
  },
  psql: {
    host: null,
    port: null,
    database: null,
    user: null,
    password: null,
    ssl: false,
  },
  email: {
    postmark_key: null,
  },
  session: {
    standard_jwt_secret: process.env.STANDARD_JWT_SECRET,
    cb_admin_jwt_secret: process.env.CB_ADMIN_JWT_SECRET,
    hmac_secret: process.env.HMAC_SECRET,
    ttl: 30 * 60 * 1000, // 30 minutes in ms
  },
  validation: {
    options: {
      abortEarly: false,
      stripUnknown: false,
    },
  },
};
