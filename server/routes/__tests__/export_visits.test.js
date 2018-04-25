const test = require('tape');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const createApp = require('../../app');
const { getConfig } = require('../../../config');
const { refresh: refreshDB } = require('../../../db/scripts');

const config = getConfig(process.env.NODE_ENV);

test('POST /api/cb/export | Correct query data received', async t => {
  const app = createApp(config);
  const secret = app.get('cfg').session.cb_admin_jwt_secret;

  const token = jwt.sign({ email: 'jinglis12@googlemail.com' }, secret);
  await refreshDB();

  const payload = {};

  const expected = {
    visit_id: 2,
    visitor_id: 2,
    visitor_name: 'britney spears',
    gender: 'female',
    yob: 1982,
    activity: 'Yoga',
    visit_date: '2018-03-20T13:32:30.000Z',
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
      t.deepEquals(res.body.result[0], expected, 'Expected object returned');
      t.end();
    });
});
