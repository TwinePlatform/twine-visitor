const test = require('tape');
const pg = require('pg');
const { getConfig } = require('../../../config');
const refreshDB = require('../../../db/scripts/refresh');
const cbLogin = require('./../../../react-backend/database/queries/cb/cb_login');
const checkCbExists = require('./../../../react-backend/database/queries/cb/cb_check_exists');

const config = getConfig(process.env.NODE_ENV);

// Community business login/register

test('test CB login detail validation query', async (t) => {
  await refreshDB();

  const client = new pg.Client(config.psql);

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
    'dev@milfordcapitalpartners.com',
    '9345a35a6fdf174dff7219282a3ae4879790dbb785c70f6fff91e32fafd66eab',
  );
  const incorrectPwd = await cbLogin(client, 'dev@milfordcapitalpartners.com', '1234');
  const incorrectEmail = await cbLogin(
    client,
    'a@a.com',
    '9345a35a6fdf174dff7219282a3ae4879790dbb785c70f6fff91e32fafd66eab',
  );
  t.equal(correct, true, 'Correct details return true');
  t.equal(incorrectEmail, false, 'Incorrect email returns false');
  t.equal(incorrectPwd, false, 'Incorrect PWD returns false');

  client.end()
    .then(t.end)
    .catch(t.end);
});

test('test checkCbExists checks', async (t) => {
  await refreshDB();

  const client = new pg.Client(config.psql);

  const correct = await checkCbExists(client, 'dev@milfordcapitalpartners.com');
  const incorrect = await checkCbExists(client, 'incorrect@nosuchemail.com');
  t.equal(correct, true, 'Correct email returns true');
  t.equal(incorrect, false, 'Incorrect email returns false');

  try {
    await checkCbExists();
    t.fail('Worked with no arguments');
  } catch (e) {
    t.pass('Rejects with no arguments');
  }

  client.end()
    .then(t.end)
    .catch(t.end);
});
