const test = require('tape');
const userCheckExists = require('../../../react-backend/database/queries/user_check_exists');

const rebuild = require('../../../react-backend/database/database_rebuild');

test('Database SELECT query | checkFullname | success case', async (t) => {
  try {
    await rebuild();
    const actual = await userCheckExists('james bond', 'hello@yahoo.com');
    t.ok(actual, 'userCheckExists returns true with correct values');
    t.end();
  } catch (error) {
    t.end(error);
  }
});

test('Database SELECT query | checkFullname | fail case', async (t) => {
  try {
    await rebuild();
    const actual = await userCheckExists('not bond', 'hello@yahoo.com');
    t.notOk(actual, 'userCheckExists returns false with incorrect values');
    t.end();
  } catch (error) {
    t.end(error);
  }
});
