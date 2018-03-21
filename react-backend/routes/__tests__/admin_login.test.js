const test = require('tape');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const createApp = require('../../app');
const { getConfig } = require('../../../config');

const config = getConfig(process.env.NODE_ENV);

test('POST /api/admin/login | password match database hash', t => {
  const app = createApp(config);
  const dbConnection = app.get('client:psql');
  const secret = app.get('cfg').session.standard_jwt_secret;

  const token = jwt.sign({ email: 'jinglis12@googlemail.com' }, secret);

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
      t.equal(res.body.success, true);
      dbConnection.end(t.end);
    });
});

test('POST /api/admin/login | no password match for database hash', t => {
  const app = createApp(config);
  const dbConnection = app.get('client:psql');
  const secret = app.get('cfg').session.standard_jwt_secret;

  const token = jwt.sign({ email: 'jinglis12@googlemail.com' }, secret);

  const failurePayload = {
    password: 'Zenith',
  };
  request(app)
    .post('/api/admin/login')
    .set('authorization', token)
    .send(failurePayload)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.notOk(err, err || 'Passes supertest expect criteria');
      t.notEqual(res.body.success, true);
      dbConnection.end(t.end);
    });
});
