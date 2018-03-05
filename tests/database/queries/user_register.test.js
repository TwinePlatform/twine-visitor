const test = require('tape');
const pg = require('pg');
const { getConfig } = require('../../../config');
const { refresh: refreshDB } = require('../../../db/scripts');
const putUserData = require('../../../react-backend/database/queries/user_register');

const config = getConfig(process.env.NODE_ENV);

test('DB Query | user_register', async tape => {
  const client = new pg.Client(config.psql);
  await client.connect();

  tape.test('user_register | adds complete user data', async t => {
    try {
      await refreshDB();

      await putUserData(
        client,
        3,
        'Jessica Jones',
        'female',
        1988,
        'super@awesome.com',
        '9fb59d630d2fb12f7478c56c5f1b2fff20e0dd7c9d3a260eee7308a8eb6cd955'
      );
      const query = await client.query(
        "SELECT EXISTS (SELECT 1 FROM users WHERE fullname = 'Jessica Jones')"
      );
      const actual = await query.rows[0].exists;

      t.ok(actual, 'putUserData successfully adds new users');
      t.end();
    } catch (error) {
      t.end(error);
    }
  });

  tape.test('user_register | fails on incomplete data', async t => {
    try {
      await refreshDB();

      await putUserData(
        client,
        3,
        'Jessica Jones',
        'female',
        1988,
        'super@awesome.com'
      );
    } catch (error) {
      t.ok(error, 'putUserData throws an error with missing hash');
      t.end();
    }
  });

  tape.test('user_register | Teardown', t => client.end(t.end));
});
