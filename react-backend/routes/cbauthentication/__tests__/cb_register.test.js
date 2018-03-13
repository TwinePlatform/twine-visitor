const test = require('tape');
const request = require('supertest');
const createApp = require('../../../app');
const { getConfig } = require('../../../../config');
const { refresh: refreshDB } = require('../../../../db/scripts');

const config = getConfig(process.env.NODE_ENV);

test('POST /api/cb/register | viable & registered CB', async t => {
  const app = createApp(config);
  const dbConnection = app.get('client:psql');

  await refreshDB();

  const successPayload = {
    formName: 'Slack Jawed and Dopamine',
    formEmail: 'jinglis12@googlemail.com',
    formGenre: 'Housing',
    formPswd: 'Chickens5*',
    formPswdConfirm: 'Chickens5*',
  };
  request(app)
    .post('/api/cb/register')
    .send(successPayload)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.notOk(err, err || 'Passes supertest expect criteria');
      t.equal(res.text, 'true');
      dbConnection.end(t.end);
    });
});

test('POST /api/cb/register | viable & non-registered CB', async t => {
    const app = createApp(config);
    const dbConnection = app.get('client:psql');

    await refreshDB();

    const successPayload = {
        formName: 'Slack Jawed and Dopamine',
        formEmail: 'email@emails.com',
        formGenre: 'Housing',
        formPswd: 'Chickens5*',
        formPswdConfirm: 'Chickens5*',
      };
    request(app)
      .post('/api/cb/register')
      .send(successPayload)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        t.notOk(err, err || 'Passes supertest expect criteria');
        t.deepEqual(res.body, { success: true });
        dbConnection.end(t.end);
      });
  });

  test('POST /api/cb/register | no input', async t => {
    const app = createApp(config);
    const dbConnection = app.get('client:psql');

    await refreshDB();

    const failurePayload = {
        formName: 'Slack Jawed and Dopamine',
        formEmail: 'email@emails.com',
        formGenre: '',
        formPswd: '',
        formPswdConfirm: '',
      };
    request(app)
      .post('/api/cb/register')
      .send(failurePayload)
      .expect(400)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        t.notOk(err, err || 'Passes supertest expect criteria');
        t.equal(res.body.validation, 'noinput');
        dbConnection.end(t.end);
      });
  });

  test('POST /api/cb/register | invalid email', async t => {
    const app = createApp(config);
    const dbConnection = app.get('client:psql');

    await refreshDB();

    const failurePayload = {
        formName: 'Slack Jawed and Dopamine',
        formEmail: 'jinglis12dshauidhiua.com',
        formGenre: 'Housing',
        formPswd: 'Chickens5*',
        formPswdConfirm: 'Chickens5*',
      };
    request(app)
      .post('/api/cb/register')
      .send(failurePayload)
      .expect(400)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        t.notOk(err, err || 'Passes supertest expect criteria');
        t.equal(res.body.validation, 'email');
        dbConnection.end(t.end);
      });
  });

  test('POST /api/cb/register | invalid name', async t => {
    const app = createApp(config);
    const dbConnection = app.get('client:psql');

    await refreshDB();

    const failurePayload = {
        formName: '1337 H4xx0R**^&&^$$(*',
        formEmail: 'jinglis12@googlemail.com',
        formGenre: 'Housing',
        formPswd: 'Chickens5*',
        formPswdConfirm: 'Chickens5*',
      };
    request(app)
      .post('/api/cb/register')
      .send(failurePayload)
      .expect(400)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        t.notOk(err, err || 'Passes supertest expect criteria');
        t.equal(res.body.validation, 'name');
        dbConnection.end(t.end);
      });
  });

  test('POST /api/cb/register | invalid email and name', async t => {
    const app = createApp(config);
    const dbConnection = app.get('client:psql');

    await refreshDB();

    const failurePayload = {
        formName: '!"£$%^&*(',
        formEmail: 'jinglglemail.com',
        formGenre: 'Housing',
        formPswd: 'Chickens5*',
        formPswdConfirm: 'Chickens5*',
      };
    request(app)
      .post('/api/cb/register')
      .send(failurePayload)
      .expect(400)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        t.notOk(err, err || 'Passes supertest expect criteria');
        t.equal(res.body.validation, 'emailname');
        dbConnection.end(t.end);
      });
  });

  test('POST /api/cb/register | weak password', async t => {
    const app = createApp(config);
    const dbConnection = app.get('client:psql');

    await refreshDB();

    const failurePayload = {
        formName: 'Slack Jawed and Dopamine',
        formEmail: 'jinglis12@googlemail.com',
        formGenre: 'Housing',
        formPswd: 'password',
        formPswdConfirm: 'password',
      };
    request(app)
      .post('/api/cb/register')
      .send(failurePayload)
      .expect(400)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        t.notOk(err, err || 'Passes supertest expect criteria');
        t.equal(res.body.validation, 'pswdweak');
        dbConnection.end(t.end);
      });
  });

  test('POST /api/cb/register | password dont match', async t => {
    const app = createApp(config);
    const dbConnection = app.get('client:psql');

    await refreshDB();

    const failurePayload = {
        formName: 'Slack Jawed and Dopamine',
        formEmail: 'jinglis12@googlemail.com',
        formGenre: 'Housing',
        formPswd: 'Chickens5*',
        formPswdConfirm: 'Turkeys5*',
      };
    request(app)
      .post('/api/cb/register')
      .send(failurePayload)
      .expect(400)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        t.notOk(err, err || 'Passes supertest expect criteria');
        t.equal(res.body.validation, 'pswdmatch');
        dbConnection.end(t.end);
      });
  });
