const test = require('tape');
const request = require('supertest');
const createApp = require('../../../app');
const tokenGen = require('../../../functions/tokengen');
const { refresh: refreshDB } = require('../../../../db/scripts');
const { getConfig } = require('../../../../config');

const config = getConfig(process.env.NODE_ENV);

test('POST /api/cb/pwd/change | token check/pw update successful', async (t) => {
  await refreshDB();
  const token = await tokenGen();
  const tokenExpire = Date.now() + 36000;
  const app = createApp(config);
  const dbConnection = app.get('client:psql');

  try {
    const queryText = 'UPDATE cbusiness SET token = $1, tokenexpire = $2 WHERE id = 3';
    await dbConnection.query(queryText, [token, tokenExpire]);
  } catch (error) {
    return t.end(error);
  }

  const payload = {
    password: 'Funnyfingers22!',
    passwordConfirm: 'Funnyfingers22!',
    token,
  };

  request(app)
    .post('/api/cb/pwd/change')
    .send(payload)
    .expect(200)
    .expect('Content-Type', /json/)
    .end(async (err, res) => {
      t.notOk(err, err || 'Passes supertest expect criteria');
      t.deepEqual(res.body, { result: null }, 'matching passwords entered/token check on db');
      const oldPassword = '0a0429fa911712f7aca189bb12995963e3fc8f361e2845f747994be499250762';

      try {
        const newPassword = await dbConnection.query('SELECT hash_pwd FROM cbusiness WHERE id = 3');
        t.notEqual(newPassword, oldPassword, 'Password has been changed in db');
        t.end();

      } catch (error) {
        t.end(error);

      } finally {
        dbConnection.end();

      }
    });
});

test('POST /api/cb/pwd/change | invalid token', (t) => {
  const app = createApp(config);
  const dbConnection = app.get('client:psql');
  const failPayload = {
    password: 'CrappyPassword7*',
    passwordConfirm: 'CrappyPassword7*',
    token: 'lol',
  };
  request(app)
    .post('/api/cb/pwd/change')
    .send(failPayload)
    .expect(401)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.notOk(err, err || 'Passes supertest expect criteria');
      t.deepEqual(res.body, { result: null, error: 'Token not recognised. Reset password again.' }, 'failed to log in with invalid token');
      dbConnection.end(t.end);
    });
});

test('POST /api/cb/pwd/change | expired token', async (t) => {
  const token = await tokenGen();
  const tokenExpire = Date.now();
  const app = createApp(config);
  const dbConnection = app.get('client:psql');

  try {
    const queryText = 'UPDATE cbusiness SET token = $1, tokenexpire = $2 WHERE id = 3';
    await dbConnection.query(queryText, [token, tokenExpire]);
  } catch (error) {
    return t.end(error);
  }

  const payload = {
    password: 'Funnyfingers22!',
    passwordConfirm: 'Funnyfingers22!',
    token,
  };

  request(app)
    .post('/api/cb/pwd/change')
    .send(payload)
    .expect(401)
    .expect('Content-Type', /json/)
    .end(async (err, res) => {
      t.notOk(err, err || 'Passes supertest expect criteria');
      t.deepEqual(res.body, { result: null, error: 'Token expired. Reset password again.' }, 'failed to log in with expired token');
      dbConnection.end(t.end);
    });
});
