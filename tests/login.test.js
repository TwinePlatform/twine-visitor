const test = require('tape');
const rebuild = require('./../react-backend/database/database_rebuild');
const cbLoginDetailsValid = require('./../react-backend/database/queries/getCBlogindetailsvalid');
const cbAlreadyExists = require('./../react-backend/database/queries/getCBAlreadyExists');

// Community business login/register

test('test CB login detail validation query', async (t) => {
  await rebuild();

  try {
    await cbLoginDetailsValid();
    t.fail('Worked with bad arguments');
  } catch (e) {
    t.pass('Bad values rejected');
  }

  const incorrect = await cbLoginDetailsValid('a@a.com', '1234');
  t.equal(incorrect, false, 'Incorrect details returns false');

  const correct = await cbLoginDetailsValid(
    'dev@milfordcapitalpartners.com',
    '9345a35a6fdf174dff7219282a3ae4879790dbb785c70f6fff91e32fafd66eab',
  );
  const incorrectPwd = await cbLoginDetailsValid(
    'dev@milfordcapitalpartners.com',
    '1234',
  );
  const incorrectEmail = await cbLoginDetailsValid(
    'a@a.com',
    '9345a35a6fdf174dff7219282a3ae4879790dbb785c70f6fff91e32fafd66eab',
  );
  t.equal(correct, true, 'Correct details return true');
  t.equal(incorrectEmail, false, 'Incorrect email returns false');
  t.equal(incorrectPwd, false, 'Incorrect PWD returns false');

  t.end();
});

test('test cbAlreadyExists checks', async (t) => {
  await rebuild();

  const correct = await cbAlreadyExists('dev@milfordcapitalpartners.com');
  const incorrect = await cbAlreadyExists('incorrect@nosuchemail.com');
  t.equal(correct, true, 'Correct email returns true');
  t.equal(incorrect, false, 'Incorrect email returns false');

  try {
    await cbAlreadyExists();
    t.fail('Worked with no arguments');
  } catch (e) {
    t.pass('Rejects with no arguments');
  }

  t.end();
  process.exit(0);
});
