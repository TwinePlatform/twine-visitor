const test = require('tape');
const pg = require('pg');
const { getConfig } = require('../../../config');
const { refresh: refreshDB } = require('../../../db/scripts');
const cbAdmin = require('../../../react-backend/shared/models/cb-admin');

const config = getConfig(process.env.NODE_ENV);
test.only('Db Query | cbAdmin.getFeedback ', async tape => {
  const client = new pg.Client(config.psql);
  await client.connect();

  tape.test('cbAdmin.getFeedback | existing cb_id', async t => {
    try {
      await refreshDB();

      const actualAll = await cbAdmin.getFeedback(client, { cbId: '3' });
      const expectedAll = [
        {
          feedback_score: -1,
          feedback_date: new Date('2017-09-09T17:45:00.000Z'),
        },
        {
          feedback_score: 0,
          feedback_date: new Date('2017-10-09T17:45:00.000Z'),
        },
        {
          feedback_score: 1,
          feedback_date: new Date('2017-11-09T17:23:00.000Z'),
        },
        {
          feedback_score: 1,
          feedback_date: new Date('2017-12-09T17:12:00.000Z'),
        },
      ];

      t.deepEquals(
        actualAll,
        expectedAll,
        'cbAdmin.getFeedback returns all cbs feedback without dates specified'
      );
      const sinceDate = new Date('2017-11-09 17:23:00+00');
      const actualSubSetWithSince = await cbAdmin.getFeedback(client, {
        cbId: '3',
        since: sinceDate,
      });
      const expectedSubSetWithSince = [
        {
          feedback_score: 1,
          feedback_date: new Date('2017-11-09T17:23:00.000Z'),
        },
        {
          feedback_score: 1,
          feedback_date: new Date('2017-12-09T17:12:00.000Z'),
        },
      ];
      t.deepEquals(
        actualSubSetWithSince,
        expectedSubSetWithSince,
        'cbAdmin.getFeedback returns subset of feedback with since defined'
      );
      const untilDate = new Date('2017-11-10 17:23:00+00');
      const actualSubSetWithSinceAndUntil = await cbAdmin.getFeedback(client, {
        cbId: '3',
        since: sinceDate,
        until: untilDate,
      });
      const expectedSubSetWithSinceAndUntil = [
        {
          feedback_score: 1,
          feedback_date: new Date('2017-11-09T17:23:00.000Z'),
        },
      ];
      t.deepEquals(
        actualSubSetWithSinceAndUntil,
        expectedSubSetWithSinceAndUntil,
        'cbAdmin.getFeedback returns subset of feedback with since and until defined'
      );
      t.end();
    } catch (error) {
      t.end(error);
    }
  });

  tape.test('cbAdmin.getFeedback | non-existing cb_id', async t => {
    try {
      await refreshDB();
      const actual = await cbAdmin.getFeedback(client, 22);

      t.deepEqual(
        actual,
        [],
        'cbAdmin.getFeedback returns empty array with non-existing cb_id'
      );
      t.end();
    } catch (error) {
      t.end(error);
    }
  });

  tape.test('cbAdmin.getFeedback | teardown', t => client.end(t.end));
});
