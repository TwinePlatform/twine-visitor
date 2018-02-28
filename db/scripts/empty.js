const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const { getConfig } = require('../../config');


const empty = async () => {
  const sql = fs.readFileSync(path.resolve(__dirname, '..', 'empty.sql'), 'utf8');
  const config = getConfig(process.env.NODE_ENV);
  const client = new Client(config.psql);

  await client.connect();
  await client.query(sql);
  await client.end();
}


module.exports = empty;


if (require.main === module) { // Invoked from the command line
  const env = process.env.NODE_ENV;

  empty()
    .then(() => console.log(`Database emptied using "${env}" configuration`))
    .catch((e) => {
      console.error(`Database could not be emptied using "${env}" configuration`);
      console.error(e);
    });
}
