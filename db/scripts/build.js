const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const { getConfig } = require('../../config');


const build = async () => {
  const sql = fs.readFileSync(path.resolve(__dirname, '..', 'schema.sql'), 'utf8');
  const config = getConfig(process.env.NODE_ENV);
  const client = new Client(config.psql);

  await client.connect();
  await client.query(sql);
  await client.end();
}


module.exports = build;


if (require.main === module) { // Invoked from the command line
  const env = process.env.NODE_ENV;

  build()
    .then(() => console.log(`Database build completed using "${env}" configuration`))
    .catch((e) => {
      console.error(`Database build unsuccessful using "${env}" configuration`);
      console.error(e);
    });
}
