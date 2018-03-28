const test = require('tape');
const pg = require('pg');
const { getConfig } = require('../../../../config');
const { refresh: refreshDB } = require('../../../../db/scripts');
const twineAdmin = require('../twine-admin');

const config = getConfig(process.env.NODE_ENV);

test('Db Query | twineAdmin ', async tape => {
  const client = new pg.Client(config.psql);
  await client.connect();

  tape.test('twineAdmin.getAllCbsNames | success', async t => {
    try {
      await refreshDB();
      const actual = await twineAdmin.getAllCbsNames(client);
      const expected = [
        { org_name: 'Dog & Fish' },
        { org_name: 'alina industries' },
        { org_name: 'Frog Finders' },
      ];
      t.deepEquals(actual, expected, 'Query returns an array of all cb names');
      t.end();
    } catch (error) {
      t.end(error);
    }
  });

  tape.test('twineAdmin | teardown', t => client.end(t.end));
});
