/*
 * Simple SQL running utilities
 */
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const { getConfig } = require('../../config');


/**
 * Creates a function to read a SQL file from a given path
 * then runs it on the DB identified by the configuration
 * object
 * @param   {String}   fpath Path to SQL file
 * @returns {Function}       Runs SQL file on DB
 */
const runSqlFile = (fpath) => async () => {
  const sql = fs.readFileSync(fpath, 'utf8');
  const config = getConfig(process.env.NODE_ENV);
  const client = new Client(config.psql);

  await client.connect();
  await client.query(sql);
  await client.end();
}


const build = runSqlFile(path.resolve(__dirname, '..', 'schema.sql'));
const destroy = runSqlFile(path.resolve(__dirname, '..', 'drop.sql'));
const empty = runSqlFile(path.resolve(__dirname, '..', 'empty.sql'));
const populate = runSqlFile(path.resolve(__dirname, '..', 'data.sql'));
const refresh = async () => {
  await destroy();
  await build();
  await populate();
}


module.exports = {
  build,
  destroy,
  empty,
  populate,
  refresh,
};


// This detects whether the file has been invoked directly from
// the command line (e.g. node ./db/scripts/index.js)
// It doesn't run if the file has only been required
if (require.main === module) {
  const env = process.env.NODE_ENV;
  const arg = process.argv[2];

  module.exports[arg]()
    .then(() => console.log(`Completed "${arg}" operation on "${env}" database`))
    .catch((e) => {
      console.error(`Failed while attempting "${arg}" operation on "${env}" database`);
      console.error(e);
    })
}
