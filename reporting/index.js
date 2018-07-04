#!/usr/bin/env node
const { Client } = require('pg');
const { getConfig } = require('../config');


const statistics = [
  {
    description: 'Organisations registered on the Visitor App',
    run: (client) =>
      client.query(`
        SELECT
          org_name AS "Organisation Name",
          email AS "E-mail",
          genre AS "Organisation Sector",
          date AS "Registration Date"
        FROM
          cbusiness
      `),
  },
  {
    description: 'Organisations with more than one visit',
    run: (client) =>
      client.query(`
        SELECT
          org_name AS "Organisation Name",
          COUNT(*) AS "Number of Visits"
        FROM
          cbusiness
            INNER JOIN visits ON visits.cb_id=cbusiness.id
        GROUP BY org_name HAVING COUNT(*) > 1
      `),
  },
];


const main = async (env) => {
  const config = getConfig(env);
  const client = new Client(config.psql);
  await client.connect();

  const results = await Promise.all(
    statistics
      .map(async ({ description, run }) => ({ description, result: await run(client) }))
  );

  results.forEach(({ description, result }) => {
    console.log('');
    console.log(description, '=>');
    console.log('Total records:', result.rowCount);
    console.log(result.rows.map((o) => ({ ...o }))); // Gets rid of the "anonymous" prefix
    console.log('');
  });

  return client.end();
};


// This detects whether the file has been invoked directly from
// the command line
if (require.main === module) {
  const env = process.env.NODE_ENV;

  console.log(`Collecting statistics in the ${env} environment`);

  main(env)
    .then(() => console.log('Done'))
    .catch(console.error);
}
