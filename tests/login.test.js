const test = require('tape');
const rebuild = require('./../react-backend/database/database_rebuild');
const cbLoginDetailsValid = require('./../react-backend/database/queries/getCBlogindetailsvalid');

// Community business login/register

test('test CB login detil validation query', async (t) => {
  await rebuild();

  try {
    await cbLoginDetailsValid();
    t.fail('Worked with bad arguments');
  } catch (e) {
    t.pass('Bad values rejected');
  }

  const incorrect = await cbLoginDetailsValid('a@a.com', '1234');
  t.equal(incorrect, false);

  const correct = await cbLoginDetailsValid(
    'dev@milfordcapitalpartners.com',
    '9345a35a6fdf174dff7219282a3ae4879790dbb785c70f6fff91e32fafd66eab',
  );
  t.equal(correct, true);

  t.end();
  process.exit(0);
});
