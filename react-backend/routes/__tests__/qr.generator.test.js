const test = require('tape');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const createApp = require('../../app');
const { getConfig } = require('../../../config');

const config = getConfig(process.env.NODE_ENV);

test('POST /api/qr/generator | Correct payload', t => {
  const app = createApp(config);
  const secret = app.get('cfg').session.standard_jwt_secret;

  const token = jwt.sign({ email: 'jinglis12@googlemail.com' }, secret);

  const payload = {
    formSender: 'Dorothy Vaughan',
    formPhone: '07123456789',
    formGender: 'female',
    formYear: 1910,
    formEmail: 'd.vaughan@naca.com',
    formEmailContact: false,
    formSmsContact: false,
  };
  request(app)
    .post('/api/qr/generator')
    .set('authorization', token)
    .send(payload)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.notOk(err, err || 'Passes supertest expect criteria');
      t.ok(res.body.qr, 'Res includes qr response');
      t.end();
    });
});

test('POST /api/qr/generator | Missing info in payload', t => {
  const app = createApp(config);
  const secret = app.get('cfg').session.standard_jwt_secret;

  const token = jwt.sign({ email: 'jinglis12@googlemail.com' }, secret);

  const payload = {
    formSender: 'Mary Jackson',
  };
  request(app)
    .post('/api/qr/generator')
    .set('authorization', token)
    .send(payload)
    .expect(400)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      const expected = {
        formPhone: ['is required'],
        formGender: ['is required'],
        formYear: ['is required'],
        formEmail: ['is required'],
        formEmailContact: ['is required'],
        formSmsContact: ['is required'],
      };

      t.notOk(err, err || 'Passes supertest expect criteria');
      t.deepEqual(
        res.body.validation,
        expected,
        'Missing info return Joi error response'
      );
      t.end();
    });
});
