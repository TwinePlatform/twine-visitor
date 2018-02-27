const { Pool } = require('pg');
require('env2')('./config/config.env');

/* istanbul ignore next */
const DB_URL =
  process.env.NODE_ENV === 'test'
    ? process.env.DATABASE_URL_TEST
    : process.env.DATABASE_URL;

/* istanbul ignore next */
if (!DB_URL) throw new Error('Environment variable DATABASE_URL must be set');

const pool = new Pool({
  connectionString: DB_URL,
});

module.exports = pool;
