const test = require('tape');
const pg = require('pg');
const { getConfig } = require('../../../config');
const { refresh: refreshDB } = require('../../../db/scripts');
const putNewUserDetails = require('../../../react-backend/database/queries/user_details_update');

const config = getConfig(process.env.NODE_ENV);

test('DB Query | user_details_update', async tape => {
  const client = new pg.Client(config.psql);
  await client.connect();

  tape.test('user_details_update | update existing user', async t => {
    try {
      await refreshDB();

      const actual = await putNewUserDetails(
        client,
        1,
        1,
        'Little Nonsense',
        'female',
        2001,
        'not@makingsense.com',
        '07534532459',
        true,
        true
      );
      const expected = {
        id: 1,
        cb_id: 1,
        fullname: 'Little Nonsense',
        sex: 'female',
        yearofbirth: 2001,
        email: 'not@makingsense.com',
        phone: '07534532459',
        date: new Date('Mon May 15 2017 12:24:57 GMT+0000 (UTC)'),
        hash: '9fb59d630d2fb12f7478c56c5f1b2fff20e0dd7c9d3a260eee7308a8eb6cd955',
        emailcontact: true,
        smscontact: true,
      };
      t.deepEquals(actual, expected, 'putNewUserDetails returns new user details');
      t.end();
    } catch (error) {
      t.end(error);
    }
  });

  tape.test('user_details_update | update existing user, undefined consent', async t => {
    try {
      await refreshDB();

      const actual = await putNewUserDetails(
        client,
        1,
        1,
        'Little Nonsense',
        'female',
        2001,
        'not@makingsense.com',
        '07534532459',
      );
      const expected = {
        id: 1,
        cb_id: 1,
        fullname: 'Little Nonsense',
        sex: 'female',
        yearofbirth: 2001,
        email: 'not@makingsense.com',
        phone: '07534532459',
        date: new Date('Mon May 15 2017 12:24:57 GMT+0000 (UTC)'),
        hash: '9fb59d630d2fb12f7478c56c5f1b2fff20e0dd7c9d3a260eee7308a8eb6cd955',
        emailcontact: false,
        smscontact: false,
      };
      t.deepEquals(actual, expected, 'putNewUserDetails returns new user details');
      t.end();
    } catch (error) {
      t.end(error);
    }
  });

  tape.test('user_details_update | update non-existing user', async t => {
    try {
      await refreshDB();

      await putNewUserDetails(
        client,
        17,
        17,
        'Little Nonsense',
        'female',
        2001,
        'not@makingsense.com',
        '07534532459',
        true,
        true
      );
    } catch (error) {
      t.ok(error, 'putNewUserDetails throws an error with incorrect details');
      t.end();
    }
  });

  tape.test('user_details_update | Teardown', t => client.end(t.end));
});
