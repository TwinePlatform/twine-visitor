/*
 * Entry point for the application
 */
const util = require('util');
const { readConfig, validateConfig } = require('../config');
const createApp = require('./app');

const env = process.env.NODE_ENV;
const arg = process.argv[2];

const config = validateConfig(readConfig(env, arg));

console.log(`Attempting to start app in "${config.env}" environment`);
console.log('Using the following configuration');
console.log(util.inspect(config, { depth: 3 }));

createApp(config)
  .listen(config.web.port, () => console.log(`Server listening on ${config.web.port}`));
