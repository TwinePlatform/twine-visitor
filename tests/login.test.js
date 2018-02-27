const test = require('tape');
const rebuild = require('./../react-backend/database/database_rebuild');
const cbLogin = require('./../react-backend/database/queries/cb/cb_login');
const checkCbExists = require('./../react-backend/database/queries/cb/cb_check_exists');

// Community business login/register

test('test CB login detail validation query', async (t) => {
  await rebuild();

  try {
    await cbLogin();
    t.fail('Worked with bad arguments');
  } catch (e) {
    t.pass('Bad values rejected');
  }

  const incorrect = await cbLogin('a@a.com', '1234');
  t.equal(incorrect, false, 'Incorrect details returns false');

  const correct = await cbLogin(
    'jinglis12@googlemail.com',
    '06dbc7f5b12c6984b3ae140221bdb54c69a81fa97dab00770a0f5a29d17a022b',
  );
  const incorrectPwd = await cbLogin('dev@milfordcapitalpartners.com', '1234');
  const incorrectEmail = await cbLogin(
    'a@a.com',
    '9345a35a6fdf174dff7219282a3ae4879790dbb785c70f6fff91e32fafd66eab',
  );
  t.equal(correct, true, 'Correct details return true');
  t.equal(incorrectEmail, false, 'Incorrect email returns false');
  t.equal(incorrectPwd, false, 'Incorrect PWD returns false');

  t.end();
});

test('test checkCbExists checks', async (t) => {
  await rebuild();

  const correct = await checkCbExists('jinglis12@googlemail.com');
  const incorrect = await checkCbExists('incorrect@nosuchemail.com');
  t.equal(correct, true, 'Correct email returns true');
  t.equal(incorrect, false, 'Incorrect email returns false');

  try {
    await checkCbExists();
    t.fail('Worked with no arguments');
  } catch (e) {
    t.pass('Rejects with no arguments');
  }

  t.end();
});
