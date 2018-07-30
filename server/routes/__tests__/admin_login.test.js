const test = require('tape');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const createApp = require('../../app');
const { getConfig } = require('../../../config');

const config = getConfig(process.env.NODE_ENV);

test('POST /api/admin/login | password match database hash', (t) => {
  const app = createApp(config);
  const dbConnection = app.get('client:psql');
  const secret = app.get('cfg').session.standard_jwt_secret;

  const token = jwt.sign({ email: 'jvalentine@umbrella.corp' }, secret);

  const successPayload = {
    password: 'Sallydog7&',
  };

  request(app)
    .post('/api/admin/login')
    .set('authorization', token)
    .send(successPayload)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {

      t.notOk(err, err || 'Passes supertest expect criteria');

      const tokenPayload = jwt.decode(res.body.result.token);

      t.deepEqual(tokenPayload.email, 'jvalentine@umbrella.corp');
      t.equal(tokenPayload.admin, true);

      dbConnection.end(t.end);
    });
});

test('POST /api/admin/login | no password match for database hash', (t) => {
  const app = createApp(config);
  const dbConnection = app.get('client:psql');
  const secret = app.get('cfg').session.standard_jwt_secret;

  const token = jwt.sign({ email: 'jvalentine@umbrella.corp' }, secret);

  const failurePayload = {
    password: 'Zenith',
  };
  request(app)
    .post('/api/admin/login')
    .set('authorization', token)
    .send(failurePayload)
    .expect(401)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.notOk(err, err || 'Passes supertest expect criteria');
      t.deepEqual(res.body, { result: null, error: 'Incorrect password' });
      dbConnection.end(t.end);
    });
});
