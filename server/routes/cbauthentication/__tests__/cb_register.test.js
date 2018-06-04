const test = require('tape');
const request = require('supertest');
const createApp = require('../../../app');
const { getConfig } = require('../../../../config');
const { refresh: refreshDB } = require('../../../../db/scripts');

const config = getConfig(process.env.NODE_ENV);

test('POST /api/cb/register | viable & registered CB', async (t) => {
  const app = createApp(config);
  const dbConnection = app.get('client:psql');

  await refreshDB();

  const successPayload = {
    orgName: 'Slack Jawed and Dopamine',
    email: 'jinglis12@googlemail.com',
    category: 'Housing',
    password: 'Chickens5*',
    passwordConfirm: 'Chickens5*',
  };

  request(app)
    .post('/api/cb/register')
    .send(successPayload)
    .expect(409)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.notOk(err, err || 'Passes supertest expect criteria');
      t.deepEqual(res.body, { result: null, error: 'Business already registered' });
      dbConnection.end(t.end);
    });
});

test('POST /api/cb/register | viable & non-registered CB', async (t) => {
  const app = createApp(config);
  const dbConnection = app.get('client:psql');

  await refreshDB();

  const successPayload = {
    orgName: 'Slack Jawed and Dopamine',
    email: 'email@emails.com',
    category: 'Housing',
    password: 'Chickens5*',
    passwordConfirm: 'Chickens5*',
  };
  request(app)
    .post('/api/cb/register')
    .send(successPayload)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.notOk(err, err || 'Passes supertest expect criteria');
      t.deepEqual(res.body, { result: null });
      dbConnection.end(t.end);
    });
});

test('POST /api/cb/register | no input', async (t) => {
  const app = createApp(config);
  const dbConnection = app.get('client:psql');

  await refreshDB();

  const failurePayload = {
    orgName: 'Slack Jawed and Dopamine',
    email: 'email@emails.com',
    category: '',
    password: '',
    passwordConfirm: '',
  };
  request(app)
    .post('/api/cb/register')
    .send(failurePayload)
    .expect(400)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.notOk(err, err || 'Passes supertest expect criteria');
      t.deepEqual(
        res.body.validation,
        {
          category: ['is not allowed to be empty'],
          password: ['is not allowed to be empty', 'with value "" fails to match the strong_pwd pattern'],
        }
      );
      dbConnection.end(t.end);
    });
});

test('POST /api/cb/register | invalid email', async (t) => {
  const app = createApp(config);
  const dbConnection = app.get('client:psql');

  await refreshDB();

  const failurePayload = {
    orgName: 'Slack Jawed and Dopamine',
    email: 'jinglis12dshauidhiua.com',
    category: 'Housing',
    password: 'Chickens5*',
    passwordConfirm: 'Chickens5*',
  };
  request(app)
    .post('/api/cb/register')
    .send(failurePayload)
    .expect(400)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.notOk(err, err || 'Passes supertest expect criteria');
      t.deepEqual(
        res.body.validation,
        {
          email: ['must be a valid email'],
        }
      );
      dbConnection.end(t.end);
    });
});

test('POST /api/cb/register | invalid name', async (t) => {
  const app = createApp(config);
  const dbConnection = app.get('client:psql');

  await refreshDB();

  const failurePayload = {
    orgName: '1337 H4xx0R**^&&^$$(*',
    email: 'jinglis12@googlemail.com',
    category: 'Housing',
    password: 'Chickens5*',
    passwordConfirm: 'Chickens5*',
  };
  request(app)
    .post('/api/cb/register')
    .send(failurePayload)
    .expect(400)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.notOk(err, err || 'Passes supertest expect criteria');
      t.deepEqual(
        res.body.validation,
        {
          orgName: ['with value "1337 H4xx0R**^&&^$$(*" matches the inverted alphanumeric pattern'],
        }
      );
      dbConnection.end(t.end);
    });
});

test('POST /api/cb/register | invalid email and name', async (t) => {
  const app = createApp(config);
  const dbConnection = app.get('client:psql');

  await refreshDB();

  const failurePayload = {
    orgName: '!"£$%^&*(',
    email: 'jinglglemail.com',
    category: 'Housing',
    password: 'Chickens5*',
    passwordConfirm: 'Chickens5*',
  };
  request(app)
    .post('/api/cb/register')
    .send(failurePayload)
    .expect(400)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.notOk(err, err || 'Passes supertest expect criteria');
      t.deepEqual(
        res.body.validation,
        {
          orgName: ['with value "!"£$%^&*(" matches the inverted alphanumeric pattern'],
          email: ['must be a valid email'],
        }
      );
      dbConnection.end(t.end);
    });
});

test('POST /api/cb/register | weak password', async (t) => {
  const app = createApp(config);
  const dbConnection = app.get('client:psql');

  await refreshDB();

  const failurePayload = {
    orgName: 'Slack Jawed and Dopamine',
    email: 'jinglis12@googlemail.com',
    category: 'Housing',
    password: 'password',
    passwordConfirm: 'password',
  };
  request(app)
    .post('/api/cb/register')
    .send(failurePayload)
    .expect(400)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.notOk(err, err || 'Passes supertest expect criteria');
      t.deepEqual(
        res.body.validation,
        {
          password: ['with value "password" fails to match the strong_pwd pattern'],
        }
      );
      dbConnection.end(t.end);
    });
});

test('POST /api/cb/register | password dont match', async (t) => {
  const app = createApp(config);
  const dbConnection = app.get('client:psql');

  await refreshDB();

  const failurePayload = {
    orgName: 'Slack Jawed and Dopamine',
    email: 'jinglis12@googlemail.com',
    category: 'Housing',
    password: 'Chickens5*',
    passwordConfirm: 'Turkeys5*',
  };
  request(app)
    .post('/api/cb/register')
    .send(failurePayload)
    .expect(400)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.notOk(err, err || 'Passes supertest expect criteria');
      t.deepEqual(
        res.body.validation,
        {
          passwordConfirm: ['must be one of [ref:password]'],
        }
      );
      dbConnection.end(t.end);
    });
});
