const test = require('tape');
const pg = require('pg');
const { getConfig } = require('../../../../config');
const { refresh: refreshDB } = require('../../../../db/scripts');
const activityCheckExists = require('../activity_exists');

const config = getConfig(process.env.NODE_ENV);

test('activity_exists', async (tape) => {
  const client = new pg.Client(config.psql);
  await client.connect();

  tape.test('activity_exists | existing activity', async (t) => {
    try {
      await refreshDB();

      const actual = await activityCheckExists(client, 'Yoga', 1);
      t.ok(actual, 'activityCheckExists returns true with existing activity');
      t.end();

    } catch (error) {
      t.end(error);
    }
  });

  tape.test('activity_exists | non-existent activity', async (t) => {
    try {
      await refreshDB();
      const actual = await activityCheckExists(client, 'Kite flying', 1);
      t.notOk(actual, 'activityCheckExists returns false with nonexisting activity');
      t.end();
    } catch (error) {
      t.end(error);
    }
  });

  tape.test('activity_exists | teardown', (t) => client.end(t.end));

});
