/*
 * Configuration defaults
 *
 * Can also hold non-secret, environment-invariant configuration
 * Merged into environment-specific configurations
 */
module.exports = {
  env: 'dev',
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
    twine_email: process.env.CB_EMAIL,
  },
  session: {
    jwt_secret: process.env.JWT_SECRET,
    admin_jwt_secret: process.env.ADMIN_JWT_SECRET,
    hmac_secret: process.env.HMAC_SECRET,
    ttl: 30 * 60 * 1000, // 30 minutes in ms
  },
};
