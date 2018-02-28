const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const { getConfig } = require('../../config');


const populate = async () => {
  const sql = fs.readFileSync(path.resolve(__dirname, '..', 'data.sql'), 'utf8');
  const config = getConfig(process.env.NODE_ENV);
  const client = new Client(config.psql);

  await client.connect();
  await client.query(sql);
  await client.end();
}


module.exports = populate;


if (require.main === module) { // Invoked from the command line
  const env = process.env.NODE_ENV;

  populate()
    .then(() => console.log(`Database populated using "${env}" configuration`))
    .catch((e) => {
      console.error(`Database could not be populated using "${env}" configuration`);
      console.error(e);
    });
}
