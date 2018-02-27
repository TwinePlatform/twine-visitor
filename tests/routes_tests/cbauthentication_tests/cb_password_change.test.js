const test = require('tape');
const request = require('supertest');
const createApp = require('../../../react-backend/app');
const tokenGen = require('../../../react-backend/functions/tokengen');
const dbConnection = require('../../../react-backend/database/dbConnection');
const rebuild = require('../../../react-backend/database/database_rebuild');
const { getConfig } = require('../../../config');

const config = getConfig(process.env.NODE_ENV);

test('POST /api/cb/pwd/change | token check/pw update successful', async (t) => {
  await rebuild();
  const token = await tokenGen();
  const tokenExpire = Date.now() + 36000;
  const app = createApp(config);

  try {
    const queryText = 'UPDATE cbusiness SET token = $1, tokenexpire = $2 WHERE id = 3';
    await dbConnection.query(queryText, [token, tokenExpire]);
  } catch (error) {
    t.end(error);
  }

  const successPayload = {
    formPswd: 'Funnyfingers22!',
    formPswdConfirm: 'Funnyfingers22!',
    token,
  };

  request(app)
    .post('/api/cb/pwd/change')
    .send(successPayload)
    .expect(200)
    .expect('Content-Type', /json/)
    .end(async (err, res) => {
      t.notOk(err, err || 'Passes supertest expect criteria');
      t.ok(res.body === true, 'matching passwords entered/token check on db returns true');
      const oldPassword = '0a0429fa911712f7aca189bb12995963e3fc8f361e2845f747994be499250762';

      try {
        const newPassword = await dbConnection.query('SELECT hash_pwd FROM cbusiness WHERE id = 3');
        t.notEqual(newPassword, oldPassword, 'Password has been changed in db');
        t.end();
      } catch (error) {
        t.end(error);
      }
    });
});

test('POST /api/cb/pwd/change | token check/pw update unsuccessful', (t) => {
  const app = createApp(config);
  const failPayload = {
    formPswd: 'lol',
    formPswdConfirm: 'lol',
    token: 'lol',
  };
  request(app)
    .post('/api/cb/pwd/change')
    .send(failPayload)
    .expect(400)
    .expect('Content-Type', /text/)
    .end((err, res) => {
      t.notOk(err, err || 'Passes supertest expect criteria');
      t.equal(res.text, 'tokenmatch', 'cb failed to log in with incorrect password');
      t.end();
    });
});
