const dbConnection = require('../../../react-backend/database/dbConnection.js');
const test = require('tape');
const request = require('supertest');
const app = require('../../../react-backend/app');

test('Route cblogin | post | successful request', (t) => {
  t.plan(3);
  const successPayload = { formEmail: 'findmyfroggy@frogfinders.com', formPswd: 'Funnyfingers11!' };
  const failPayload = { formEmail: 'findmyfroggy@frogfinders.com', formPswd: 'password123' };
  const emptyPayload = { formEmail: '', formPswd: '' };
  request(app)
    .post('/api/cb/login')
    .send(successPayload)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.ok(res.body.success, 'cb successfully logged in with correct password');
    });
  request(app)
    .post('/api/cb/login')
    .send(failPayload)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.notOk(res.body.success, 'cb failed to log in with incorrect password');
    });
  request(app)
    .post('/api/cb/login')
    .send(emptyPayload)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.notOk(res.body.success, 'cb failed to log in with no submitted data');
    });
});
