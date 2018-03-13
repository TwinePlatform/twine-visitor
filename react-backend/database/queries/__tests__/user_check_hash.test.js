const test = require('tape');
const pg = require('pg');
const { getConfig } = require('../../../../config');
const { refresh: refreshDB } = require('../../../../db/scripts');
const getHash = require('../user_check_hash');

const config = getConfig(process.env.NODE_ENV);

test('DB Query | user_check_hash', async tape => {
  const client = new pg.Client(config.psql);
  await client.connect();

  tape.test('user_check_hash | existing hash', async t => {
    try {
      await refreshDB();
      const actual = await getHash(
        client,
        '9fb59d630d2fb12f7478c56c5f1b2fff20e0dd7c9d3a260eee7308a8eb6cd955'
      );
      const expected = {
        fullname: 'james bond',
        hash:
          '9fb59d630d2fb12f7478c56c5f1b2fff20e0dd7c9d3a260eee7308a8eb6cd955',
      };
      t.deepEqual(
        actual,
        expected,
        'getHash returns user details with correct hash'
      );

      t.end();
    } catch (error) {
      t.end(error);
    }
  });

  tape.test('user_check_hash | non-existing hash', async t => {
    try {
      await refreshDB();
      await getHash(client);
    } catch (error) {
      t.ok(error, 'getHash throws an error with missing hash');
      t.end();
    }
  });

  tape.test('user_check_hash | Teardown', t => client.end(t.end));
});
