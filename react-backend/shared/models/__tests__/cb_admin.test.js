const test = require('tape');
const pg = require('pg');
const { getConfig } = require('../../../../config');
const { refresh: refreshDB } = require('../../../../db/scripts');
const cbAdmin = require('../../../shared/models/cb_admin');

const config = getConfig(process.env.NODE_ENV);

test('Db Query | cbAdmin ', async tape => {
  const client = new pg.Client(config.psql);
  await client.connect();

  tape.test('cbAdmin.getFeedback | existing cb_id', async t => {
    try {
      await refreshDB();

      const actualAll = await cbAdmin.getFeedback(client, { cbId: '3' });
      const expectedAll = [
        { count: '1', feedback_score: -1 },
        { count: '1', feedback_score: 0 },
        { count: '2', feedback_score: 1 },
      ];

      t.deepEquals(
        actualAll,
        expectedAll,
        'cbAdmin.getFeedback returns count of cbs feedback'
      );
      const sinceDate = new Date('2017-11-09 17:23:00+00');
      const actualSubSetWithSince = await cbAdmin.getFeedback(client, {
        cbId: '3',
        since: sinceDate,
      });
      const expectedSubSetWithSince = [{ count: '2', feedback_score: 1 }];
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
        { count: '1', feedback_score: 1 },
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

  tape.test('cbAdmin.insertFeedback | correct values', async t => {
    try {
      await refreshDB();
      const actual = await cbAdmin.insertFeedback(client, {
        cbId: 3,
        feedbackScore: -1,
      });
      delete actual.feedback_date;
      const expected = {
        id: 10,
        cb_id: 3,
        feedback_score: -1,
      };
      t.deepEqual(
        actual,
        expected,
        'cbAdmin.insertFeedback returns array of inputted data'
      );
      t.end();
    } catch (error) {
      t.end(error);
    }
  });

  tape.test('cbAdmin.insertFeedback | incorrect values', async t => {
    try {
      await refreshDB();
      await cbAdmin.insertFeedback(client, {
        cbEmail: 'imafake@googlemail.com',
        feedbackScore: -1,
      });
    } catch (error) {
      t.ok(
        error,
        'Query throws an error if non-existent cbId value is entered'
      );
      t.end();
    }
  });

  tape.test('cbAdmin | teardown', t => client.end(t.end));
});
