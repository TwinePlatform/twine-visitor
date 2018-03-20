const test = require('tape');
const pg = require('pg');
const { getConfig } = require('../../../config');
const { refresh: refreshDB } = require('../../../db/scripts');
const getUserDetails = require('../../../react-backend/database/queries/user_details');

const config = getConfig(process.env.NODE_ENV);

test('DB Query | user_details', async tape => {
  const client = new pg.Client(config.psql);
  await client.connect();

  tape.test('user_details | existing user', async t => {
    try {
      await refreshDB();

      const actual = await getUserDetails(client, '1', '1');
      const expected = [
        {
          id: 1,
          cb_id: 1,
          fullname: 'james bond',
          sex: 'male',
          yearofbirth: 1984,
          email: 'hello@yahoo.com',
          phone: '7538654284',
          date: new Date('Mon May 15 2017 12:24:57 GMT+0000 (UTC)'),
          hash: '9fb59d630d2fb12f7478c56c5f1b2fff20e0dd7c9d3a260eee7308a8eb6cd955',
          emailcontact: true,
          smscontact: true,
        },
      ];
      t.deepEquals(actual, expected, 'getUserDetails returns true with correct values');
      t.end();
    } catch (error) {
      t.end(error);
    }
  });

  tape.test('user_details | non-existing user', async t => {
    try {
      await refreshDB();

      const actual = await getUserDetails(client, '18', '1');

      t.deepEquals(actual, [], 'getUserDetails returns empty array with incorrect values');
      t.end();
    } catch (error) {
      t.end(error);
    }
  });

  tape.test('user_details | Teardown', t => client.end(t.end));
});
