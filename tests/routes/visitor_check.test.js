const test = require('tape');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const createApp = require('../../react-backend/app');
const { getConfig } = require('../../config');

const config = getConfig(process.env.NODE_ENV);

test('POST /api/visit/check | viable name & email & exists in database', t => {
  const app = createApp(config);
  const dbConnection = app.get('client:psql');
  const secret = app.get('cfg').session.standard_jwt_secret;

  const token = jwt.sign({ email: 'jinglis12@googlemail.com' }, secret);

  const successPayload = {
    formSender: 'James Bond',
    formEmail: 'hello@yahoo.com',
    formPhone: '07534532495',
    formGender: 'male',
    formYear: '2007',
  };
  request(app)
    .post('/api/visit/check')
    .set('authorization', token)
    .send(successPayload)
    .expect(409)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.notOk(err, err || 'Passes supertest expect criteria');
      t.equal(res.text, 'true');
      dbConnection.end(t.end);
    });
});

test('POST /api/visit/check | viable name & email & not found in database', t => {
  const app = createApp(config);
  const dbConnection = app.get('client:psql');
  const secret = app.get('cfg').session.standard_jwt_secret;

  const token = jwt.sign({ email: 'jinglis12@googlemail.com' }, secret);

  const successPayload = {
    formSender: 'John The Ripper',
    formEmail: 'goodbye@yahoo.com',
    formPhone: '076463746264',
    formGender: 'male',
    formYear: '2007',
  };
  request(app)
    .post('/api/visit/check')
    .set('authorization', token)
    .send(successPayload)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.notOk(err, err || 'Passes supertest expect criteria');
      t.equal(res.text, 'false');
      dbConnection.end(t.end);
    });
});

test('POST /api/visit/check | bad name & viable email', t => {
  const app = createApp(config);
  const dbConnection = app.get('client:psql');
  const secret = app.get('cfg').session.standard_jwt_secret;

  const token = jwt.sign({ email: 'jinglis12@googlemail.com' }, secret);

  const failPayload = {
    formSender: 'addi7837***&&$$%$%',
    formEmail: 'hello@yahoo.com',
    formPhone: '076463746264',
    formGender: 'male',
    formYear: '2007',
  };
  request(app)
    .post('/api/visit/check')
    .set('authorization', token)
    .send(failPayload)
    .expect(400)
    .expect('Content-Type', /text/)
    .end((err, res) => {
      t.notOk(err, err || 'Passes supertest expect criteria');
      t.equal(res.text, 'name');
      dbConnection.end(t.end);
    });
});

test('POST /api/visit/check | viable name & bad email', t => {
  const app = createApp(config);
  const dbConnection = app.get('client:psql');
  const secret = app.get('cfg').session.standard_jwt_secret;

  const token = jwt.sign({ email: 'jinglis12@googlemail.com' }, secret);

  const failPayload = {
    formSender: 'James Bond',
    formEmail: 'helloyahoo.com',
    formPhone: '076463746264',
    formGender: 'male',
    formYear: '2007',
  };
  request(app)
    .post('/api/visit/check')
    .set('authorization', token)
    .send(failPayload)
    .expect(400)
    .expect('Content-Type', /text/)
    .end((err, res) => {
      t.notOk(err, err || 'Passes supertest expect criteria');
      t.equal(res.text, 'email');
      dbConnection.end(t.end);
    });
});

test('POST /api/visit/check | bad name & email', t => {
  const app = createApp(config);
  const dbConnection = app.get('client:psql');
  const secret = app.get('cfg').session.standard_jwt_secret;

  const token = jwt.sign({ email: 'jinglis12@googlemail.com' }, secret);

  const failPayload = {
    formSender: 'Jame77***"%s Bond',
    formEmail: 'helloyahoo.com',
    formPhone: '076463746264',
    formGender: 'male',
    formYear: '2007',
  };
  request(app)
    .post('/api/visit/check')
    .set('authorization', token)
    .send(failPayload)
    .expect(400)
    .expect('Content-Type', /text/)
    .end((err, res) => {
      t.notOk(err, err || 'Passes supertest expect criteria');
      t.equal(res.text, 'emailname');
      dbConnection.end(t.end);
    });
});

test('POST /api/visit/check | no input test', t => {
  const app = createApp(config);
  const dbConnection = app.get('client:psql');
  const secret = app.get('cfg').session.standard_jwt_secret;

  const token = jwt.sign({ email: 'jinglis12@googlemail.com' }, secret);

  const failPayload = {
    formSender: '',
    formEmail: '',
    formPhone: '',
    formGender: '',
    formYear: '2007',
  };
  request(app)
    .post('/api/visit/check')
    .set('authorization', token)
    .send(failPayload)
    .expect(400)
    .expect('Content-Type', /text/)
    .end((err, res) => {
      t.notOk(err, err || 'Passes supertest expect criteria');
      t.equal(res.text, 'noinput');
      dbConnection.end(t.end);
    });
});
