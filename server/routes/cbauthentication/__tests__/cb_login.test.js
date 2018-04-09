const test = require('tape');
const request = require('supertest');
const createApp = require('../../../app');
const { getConfig } = require('../../../../config');

const config = getConfig(process.env.NODE_ENV);

test('POST /api/cb/login', (tape) => {
  const app = createApp(config);
  const dbConnection = app.get('client:psql');

  tape.test('POST /api/cb/login | authentication successful', (t) => {
    const successPayload = { email: 'findmyfroggy@frogfinders.com', password: 'Funnyfingers11!' };

    request(app)
      .post('/api/cb/login')
      .send(successPayload)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        t.ok(res.body.result.token, 'cb successfully logged in with correct password');
        t.end();
      });
  });

  tape.test('POST /api/cb/login | authentication unsuccessful', (t) => {
    t.plan(6);

    const failPayload = { email: 'findmyfroggy@frogfinders.com', password: 'password123' };
    const emptyPayload = { email: '', password: '' };

    request(app)
      .post('/api/cb/login')
      .send(failPayload)
      .expect(401)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        t.notOk(err, err || 'Passes supertest expect criteria');
        t.deepEqual(res.body, { result: null, error: 'Credentials not recognised' }, 'failed to log in with incorrect password');
      });

    request(app)
      .post('/api/cb/login')
      .send(emptyPayload)
      .expect(400)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        t.notOk(err, err || 'Passes supertest expect criteria');
        t.ok(res.body.error);
        t.equal(res.body.result, null);
        t.deepEqual(res.body.validation, {
          email: ['is not allowed to be empty', 'must be a valid email'],
          password: ['is not allowed to be empty', 'length must be at least 1 characters long'],
        });
      });
  });

  tape.test('POST /api/cb/login | teardown', (t) => dbConnection.end(t.end));
});

