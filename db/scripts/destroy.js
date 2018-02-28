const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const { getConfig } = require('../../config');


const destroy = async () => {
  const sql = fs.readFileSync(path.resolve(__dirname, '..', 'drop.sql'), 'utf8');
  const config = getConfig(process.env.NODE_ENV);
  const client = new Client(config.psql);

  await client.connect();
  await client.query(sql);
  await client.end();
}


module.exports = destroy;


if (require.main === module) { // Invoked from the command line
  const env = process.env.NODE_ENV;

  destroy()
    .then(() => console.log(`Database destroyed using "${env}" configuration`))
    .catch((e) => {
      console.error(`Database could not be destroyed using "${env}" configuration`);
      console.error(e);
    });
}
