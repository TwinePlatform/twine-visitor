const test = require('tape');
const pg = require('pg');
const { getConfig } = require('../../../config');
const { refresh: refreshDB } = require('../../../db/scripts');
const cbAdmin = require('../../../react-backend/shared/models/cb-admin');

const config = getConfig(process.env.NODE_ENV);
test.only('Db Query | cbAdmin.getCbFeedback ', async tape => {
  const client = new pg.Client(config.psql);
  await client.connect();

  tape.test('cbAdmin.getCbFeedback | existing cb_id', async t => {
    try {
      await refreshDB();

      const actual = await cbAdmin.getCbFeedback(client, '3');
      const expected = [
        {
          user_feedback: -1,
          feedback_date: new Date('2017-09-09T17:45:00.000Z'),
        },
        {
          user_feedback: 0,
          feedback_date: new Date('2017-10-09T17:45:00.000Z'),
        },
        {
          user_feedback: 1,
          feedback_date: new Date('2017-11-09T17:23:00.000Z'),
        },
        {
          user_feedback: 1,
          feedback_date: new Date('2017-12-09T17:12:00.000Z'),
        },
      ];

      t.deepEquals(
        actual,
        expected,
        'cbAdmin.getCbFeedback returns true with correct values'
      );
      t.end();
    } catch (error) {
      t.end(error);
    }
  });

  tape.test('cbAdmin.getCbFeedback | non-existing cb_id', async t => {
    try {
      await refreshDB();
      const actual = await cbAdmin.getCbFeedback(client, 22);

      t.deepEqual(
        actual,
        [],
        'cbAdmin.getCbFeedback returns empty array with non-existing cb_id'
      );
      t.end();
    } catch (error) {
      t.end(error);
    }
  });

  tape.test('cbAdmin.getCbFeedback | teardown', t => client.end(t.end));
});
