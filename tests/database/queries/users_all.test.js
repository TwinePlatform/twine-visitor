const test = require('tape');
const pg = require('pg');
const { getConfig } = require('../../../config');
const { refresh: refreshDB } = require('../../../db/scripts');
const getUserList = require('../../../react-backend/database/queries/users_all');

const config = getConfig(process.env.NODE_ENV);

test('DB Query | users_all', async tape => {
  const client = new pg.Client(config.psql);
  await client.connect();

  tape.test('users_all | existing cb id', async t => {
    try {
      await refreshDB();
      const actual = await getUserList(client, 1);

      const expected = [
        {
          id: 1,
          fullname: 'james bond',
          sex: 'male',
          yearofbirth: 1984,
          email: 'hello@yahoo.com',
          date: new Date('Mon May 15 2017 12:24:57 GMT+0000 (UTC)'),
        },
        {
          id: 2,
          fullname: 'britney spears',
          sex: 'female',
          yearofbirth: 1982,
          email: 'goodbye@gmail.com',
          date: new Date('Mon May 15 2017 12:24:56 GMT+0000 (UTC)'),
        },
        {
          id: 3,
          fullname: 'aldous huxley',
          sex: 'female',
          yearofbirth: 1993,
          email: 'sometimes@gmail.com',
          date: new Date('Mon May 15 2017 12:24:52 GMT+0000 (UTC)'),
        },
      ];

      t.deepEquals(
        actual,
        expected,
        'getUserList successfully returns all users associated with a community business'
      );
      t.end();
    } catch (error) {
      t.end(error);
    }
  });

  tape.test('users_all | non-existing cb id', async t => {
    try {
      await refreshDB();

      const actual = await getUserList(client, 707);
      t.deepEquals(
        actual,
        [],
        'getUserList returns empty array with incorrect values'
      );
      t.end();
    } catch (error) {
      t.end(error);
    }
  });

  tape.test('users_all | Teardown', t => client.end(t.end));
});
