const test = require('tape');
const pg = require('pg');
const { getConfig } = require('../../../../config');
const { refresh: refreshDB } = require('../../../../db/scripts');
const insertVisit = require('../visit_insert');

const config = getConfig(process.env.NODE_ENV);

test('DB Query | visit_insert', async (tape) => {
  const client = new pg.Client(config.psql);
  await client.connect();

  tape.test('visit_insert | success case', async (t) => {
    try {
      await refreshDB();
      const oldCount = await client.query(
        'SELECT * FROM visits WHERE usersId = 1 AND activitiesId = 5'
      );

      await insertVisit(
        client,
        '9fb59d630d2fb12f7478c56c5f1b2fff20e0dd7c9d3a260eee7308a8eb6cd955',
        'Flamenco Dancing',
        1
      );

      const actual = await client.query(
        'SELECT * FROM visits WHERE usersId = 1 AND activitiesId = 5'
      );
      t.equals(
        actual.rows.length,
        oldCount.rows.length + 1,
        'insertVisit adds new visit'
      );

      t.end();
    } catch (error) {
      t.end(error);
    }
  });

  tape.test('visit_insert | duplicate name', async (t) => {
    try {
      await refreshDB();
      await client.query(
        `INSERT INTO activities
          (name, cb_id, monday, tuesday, wednesday, thursday, friday, saturday, sunday)
        VALUES
          ($1, $2, $3, $3, $3, $3, $3, $3, $3)`,
        ['Swimming', 1, true]
      );

      const oldCount = await client.query(
        'SELECT * FROM visits WHERE usersId = 1 AND activitiesId = 7'
      );

      await insertVisit(
        client,
        '9fb59d630d2fb12f7478c56c5f1b2fff20e0dd7c9d3a260eee7308a8eb6cd955',
        'Swimming',
        1
      );

      const actual = await client.query(
        'SELECT * FROM visits WHERE usersId = 1 AND activitiesId = 7'
      );
      const newVisit = await client.query('SELECT EXISTS (SELECT * FROM visits WHERE usersid=$1 AND cb_id=$2)', [1, 1]);

      t.equals(
        actual.rows.length,
        oldCount.rows.length + 1,
        'insertVisit adds new visit'
      );
      t.ok(
        newVisit.rows[0].exists,
        'Newly inserted visit registered against correct CB, despite duplicate name'
      );

      t.end();
    } catch (error) {
      t.end(error);
    }
  });

  tape.test('visit_insert | missing data', async (t) => {
    try {
      await refreshDB();
      const actual = await await insertVisit(client);
      t.deepEquals(
        actual.rows,
        [],
        'insertVisit returns empty array without any arguments'
      );

      t.end();
    } catch (error) {
      t.end(error);
    }
  });

  tape.test('visit_insert | Teardown', (t) => client.end(t.end));
});
