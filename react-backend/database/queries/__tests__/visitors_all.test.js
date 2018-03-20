const test = require('tape');
const pg = require('pg');
const { getConfig } = require('../../../../config');
const { refresh: refreshDB } = require('../../../../db/scripts');
const getAllUsersQuery = require('../visitors_all');

const config = getConfig(process.env.NODE_ENV);

test('DB Query | visitors_all', async tape => {
  const client = new pg.Client(config.psql);
  await client.connect();

  tape.test('visitors_all | success case', async t => {
    try {
      await refreshDB();

      const actual = await getAllUsersQuery(client, 3);
      const expected = [
        {
          id: 4,
          sex: 'female',
          yearofbirth: 1998,
          name: 'Swimming',
          date: new Date('Sat Apr 29 2017 22:03:17 GMT+0000 (UTC)'),
        },
        {
          id: 4,
          sex: 'female',
          yearofbirth: 1998,
          name: 'Swimming',
          date: new Date('Thu Jun 22 2017 17:45:00 GMT+0000 (UTC)'),
        },
      ];
      t.deepEquals(actual, expected, 'getAllUsers returns inner join magic');
      t.end();
    } catch (error) {
      t.end(error);
    }
  });

  tape.test('visitors_all | missing data', async t => {
    try {
      await refreshDB();

      const actual = await getAllUsersQuery(client);
      t.deepEquals(
        actual,
        [],
        'getAllUsers returns empty array with missing data'
      );

      t.end();
    } catch (error) {
      t.end(error);
    }
  });

  tape.test('visitors_all | Teardown', t => client.end(t.end));
});
