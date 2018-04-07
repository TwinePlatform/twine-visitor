/*
 * Configuration entry point
 *
 * Exports functions used to generate a single normalised configuration object
 */
require('env2')('./config/config.env');

const fs = require('fs');
const url = require('url');
const Joi = require('joi');
const { mergeDeepRight } = require('ramda');
const schema = require('./config.schema');
const defaults = require('./config.defaults');


/**
 * Parses database connection string into connection object
 * used by node-postgres Client constructor
 *
 * @param   {String} str Database URL to parse
 * @returns {Object}     Database connection parameters
 */
const parseDbUrl = (str) => {
  const {
    auth,
    pathname: database,
    hostname: host,
    port,
    query: { ssl },
  } = url.parse(str, true);

  const [user, password] = auth.split(':');

  return { database: database.slice(1), host, port, user, password, ssl: Boolean(ssl) };
};


/**
 * Describes the transformations of the default configuration object
 * in the various supported deployment environments
 */
const nodeEnvs = {
  dev: (cfg) =>
    mergeDeepRight(cfg, {
      env: 'dev',
      web: { port: 4000 },
      psql: parseDbUrl(process.env.DATABASE_URL_DEV),
      email: { postmark_key: process.env.POSTMARK_KEY_DEV },
    }),

  test: (cfg) =>
    mergeDeepRight(cfg, {
      env: 'test',
      web: { port: 4001 },
      psql: parseDbUrl(process.env.DATABASE_URL_TEST),
      email: { postmark_key: process.env.POSTMARK_KEY_TEST },
    }),

  prod: (cfg) =>
    mergeDeepRight(cfg, {
      env: 'prod',
      web: { port: process.env.PORT || 4002 },
      psql: parseDbUrl(process.env.DATABASE_URL || process.env.DATABASE_URL_PROD),
      email: { postmark_key: process.env.POSTMARK_KEY_PROD },
    }),
};


/**
 * Given the deployment environment, applies the appropriate
 * transformations to the default config.
 *
 * Allows an optional filepath for a config override JSON file.
 *
 * @param   {String} [env=dev] Environment for which to get config
 * @param   {String} [path]    Path from which to read optional config file
 * @returns {Object}           Fully merged configuration object
 */
const readConfig = (env = 'dev', path) => {
  const config = path
    ? JSON.parse(fs.readFileSync(path, 'utf8'))
    : {};

  return mergeDeepRight(nodeEnvs[env](defaults), config);
};


/**
 * Validates the given configuration object against the default schema
 *
 * @param   {Object} cfg Configuration object to validate
 * @returns {Object}     Parsed and validated configuration object
 */
const validateConfig = (cfg) => {
  const { error, value } = Joi.validate(cfg, schema);

  if (error) {
    throw error;
  }

  return value;
};

/**
 * Utility shortcut for reading and validating configuration
 * @param   {String} env    Deployment environment
 * @param   {String} [path] Optional path for configuration override file
 * @returns {Object}        Validated configuration object
 */
const getConfig = (env, path) => validateConfig(readConfig(env, path));


module.exports = {
  readConfig,
  validateConfig,
  getConfig,
};
