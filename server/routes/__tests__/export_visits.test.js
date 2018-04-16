const test = require('tape');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const createApp = require('../../app');
const { getConfig } = require('../../../config');

const config = getConfig(process.env.NODE_ENV);

test('POST /api/cb/export | Correct token', t => {
  const app = createApp(config);
  const secret = app.get('cfg').session.cb_admin_jwt_secret;

  const token = jwt.sign({ email: 'jinglis12@googlemail.com' }, secret);

  const payload = {
  };
  request(app)
    .post('/api/cb/export')
    .set('authorization', token)
    .send(payload)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.notOk(err, err || 'Passes supertest expect criteria');
      t.ok(res.body.result, 'Res includes result object');
      t.end();
    });
});

test('POST /api/cb/export | Incorrect Token', t => {
  const app = createApp(config);
  const secret = app.get('cfg').session.standard_jwt_secret;

  const token = jwt.sign({ email: 'jinglis12@googlemail.com' }, secret);

  const payload = {
  };
  request(app)
    .post('/api/cb/export')
    .set('authorization', token)
    .send(payload)
    .expect(401)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.notOk(err, err || 'Passes supertest expect criteria');
      t.notOk(res.body.result, 'Res does not include results object');
      t.end();
    });
});
