const test = require('tape');
const request = require('supertest');
const createApp = require('../../../react-backend/app');
const { getConfig } = require('../../../config');
const { refresh: refreshDB } = require('../../../db/scripts');

const config = getConfig(process.env.NODE_ENV);

test('POST /api/cb/register/check | viable & registered CB', async t => {
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
    .post('/api/cb/register/check')
    .send(successPayload)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.notOk(err, err || 'Passes supertest expect criteria');
      t.equal(res.text, 'true');
      dbConnection.end(t.end);
    });
});

test('POST /api/cb/register/check | viable & non-registered CB', async t => {
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
      .post('/api/cb/register/check')
      .send(successPayload)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        t.notOk(err, err || 'Passes supertest expect criteria');
        t.equal(res.text, 'false');
        dbConnection.end(t.end);
      });
  });

  test('POST /api/cb/register/check | no input', async t => {
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
      .post('/api/cb/register/check')
      .send(failurePayload)
      .expect(400)
      .expect('Content-Type', /text/)
      .end((err, res) => {
        t.notOk(err, err || 'Passes supertest expect criteria');
        t.equal(res.text, 'noinput');
        dbConnection.end(t.end);
      });
  });

  test('POST /api/cb/register/check | invalid email', async t => {
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
      .post('/api/cb/register/check')
      .send(failurePayload)
      .expect(400)
      .expect('Content-Type', /text/)
      .end((err, res) => {
        t.notOk(err, err || 'Passes supertest expect criteria');
        t.equal(res.text, 'email');
        dbConnection.end(t.end);
      });
  });

  test('POST /api/cb/register/check | invalid name', async t => {
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
      .post('/api/cb/register/check')
      .send(failurePayload)
      .expect(400)
      .expect('Content-Type', /text/)
      .end((err, res) => {
        t.notOk(err, err || 'Passes supertest expect criteria');
        t.equal(res.text, 'name');
        dbConnection.end(t.end);
      });
  });

  test('POST /api/cb/register/check | invalid email and name', async t => {
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
      .post('/api/cb/register/check')
      .send(failurePayload)
      .expect(400)
      .expect('Content-Type', /text/)
      .end((err, res) => {
        t.notOk(err, err || 'Passes supertest expect criteria');
        t.equal(res.text, 'emailname');
        dbConnection.end(t.end);
      });
  });

  test('POST /api/cb/register/check | weak password', async t => {
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
      .post('/api/cb/register/check')
      .send(failurePayload)
      .expect(400)
      .expect('Content-Type', /text/)
      .end((err, res) => {
        t.notOk(err, err || 'Passes supertest expect criteria');
        t.equal(res.text, 'pswdweak');
        dbConnection.end(t.end);
      });
  });

  test('POST /api/cb/register/check | password dont match', async t => {
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
      .post('/api/cb/register/check')
      .send(failurePayload)
      .expect(400)
      .expect('Content-Type', /text/)
      .end((err, res) => {
        t.notOk(err, err || 'Passes supertest expect criteria');
        t.equal(res.text, 'pswdmatch');
        dbConnection.end(t.end);
      });
  });
