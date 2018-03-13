const test = require('tape');
const pg = require('pg');
const { getConfig } = require('../../../config');
const { refresh: refreshDB } = require('../../../db/scripts');
const cbLogin = require('./../../../react-backend/database/queries/cb/cb_login');
const checkCbExists = require('./../../../react-backend/database/queries/cb/cb_check_exists');

const config = getConfig(process.env.NODE_ENV);

// Community business login/register

test('test CB login detail validation query', async (t) => {
  await refreshDB();

  const client = new pg.Client(config.psql);
  await client.connect();

  try {
    await cbLogin(client);
    t.fail('Worked with bad arguments');
  } catch (e) {
    t.pass('Bad values rejected');
  }

  const incorrect = await cbLogin(client, 'a@a.com', '1234');
  t.equal(incorrect, false, 'Incorrect details returns false');

  const correct = await cbLogin(
    client,
    'findmyfroggy@frogfinders.com',
    '0a0429fa911712f7aca189bb12995963e3fc8f361e2845f747994be499250762',
  );
  const incorrectPwd = await cbLogin(client, 'findmyfroggy@frogfinders.com', '1234');
  const incorrectEmail = await cbLogin(
    client,
    'a@a.com',
    '0a0429fa911712f7aca189bb12995963e3fc8f361e2845f747994be499250762',
  );
  t.equal(correct, true, 'Correct details return true');
  t.equal(incorrectEmail, false, 'Incorrect email returns false');
  t.equal(incorrectPwd, false, 'Incorrect PWD returns false');

  await client.end();
  t.end();
});

test('test checkCbExists checks', async (t) => {
  await refreshDB();

  const client = new pg.Client(config.psql);
  await client.connect();

  const correct = await checkCbExists(client, 'findmyfroggy@frogfinders.com');
  const incorrect = await checkCbExists(client, 'incorrect@nosuchemail.com');
  t.equal(correct, true, 'Correct email returns true');
  t.equal(incorrect, false, 'Incorrect email returns false');

  try {
    await checkCbExists();
    t.fail('Worked with no arguments');
  } catch (e) {
    t.pass('Rejects with no arguments');
  }

  await client.end();
  t.end();
});
