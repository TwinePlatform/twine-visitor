const test = require('tape');
const pg = require('pg');
const { getConfig } = require('../../../../config');
const { refresh: refreshDB } = require('../../../../db/scripts');
const getUserList = require('../users_all');

const config = getConfig(process.env.NODE_ENV);

test('DB Query | users_all', async tape => {
  const client = new pg.Client(config.psql);
  await client.connect();

  tape.test('users_all | existing cb id', async t => {
    try {
      await refreshDB();
      const actual = await getUserList(client, { where: { cb_id: 1 } });

      const expected = [
        {
          id: 1,
          name: 'james bond',
          gender: 'male',
          yob: 1984,
          email: 'hello@yahoo.com',
          registered_at: new Date('Mon May 15 2017 12:24:57 GMT+0000 (UTC)'),
          email_consent: true,
          sms_consent: true,
        },
        {
          id: 2,
          name: 'britney spears',
          gender: 'female',
          yob: 1982,
          email: 'goodbye@gmail.com',
          registered_at: new Date('Mon May 15 2017 12:24:56 GMT+0000 (UTC)'),
          email_consent: true,
          sms_consent: false,
        },
        {
          id: 3,
          name: 'aldous huxley',
          gender: 'female',
          yob: 1993,
          email: 'sometimes@gmail.com',
          registered_at: new Date('Mon May 15 2017 12:24:52 GMT+0000 (UTC)'),
          email_consent: false,
          sms_consent: true,
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

      const actual = await getUserList(client, { where: { id: 707 } });
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
