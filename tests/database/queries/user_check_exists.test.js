const test = require('tape');
const pg = require('pg');
const { getConfig } = require('../../../config');
const { refresh: refreshDB } = require('../../../db/scripts');
const userCheckExists = require('../../../react-backend/database/queries/user_check_exists');

const config = getConfig(process.env.NODE_ENV);

test('user_check_exists', async (tape) => {
  const client = new pg.Client(config.psql);
  await client.connect();

  tape.test('user_check_exists | existing user', async (t) => {
    try {
      await refreshDB();

      const actual = await userCheckExists(client, 'james bond', 'hello@yahoo.com');
      t.ok(actual, 'userCheckExists returns true with correct values');
      t.end();

    } catch (error) {
      t.end(error);
    }
  });

  tape.test('user_check_exists | non-existent user', async (t) => {
    try {
      await refreshDB();
      const actual = await userCheckExists(client, 'not bond', 'hello@yahoo.com');
      t.notOk(actual, 'userCheckExists returns false with incorrect values');
      t.end();
    } catch (error) {
      t.end(error);
    }
  });

  tape.test('user_check_exists | teardown', (t) => client.end(t.end));

});
