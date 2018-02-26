const test = require('tape');
const request = require('supertest');
const app = require('../../../react-backend/app');

test('POST /api/cb/login | authentication successful', (t) => {
  const successPayload = { formEmail: 'findmyfroggy@frogfinders.com', formPswd: 'Funnyfingers11!' };
  request(app)
    .post('/api/cb/login')
    .send(successPayload)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.ok(res.body.success, 'cb successfully logged in with correct password');
      t.end();
    });
});
test('POST /api/cb/login | authentication unsuccessful', (t) => {
  t.plan(4);
  const failPayload = { formEmail: 'findmyfroggy@frogfinders.com', formPswd: 'password123' };
  const emptyPayload = { formEmail: '', formPswd: '' };
  request(app)
    .post('/api/cb/login')
    .send(failPayload)
    .expect(401)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.notOk(err, err || 'Passes supertest expect criteria');
      t.notOk(res.body.success, 'cb failed to log in with incorrect password');
    });
  request(app)
    .post('/api/cb/login')
    .send(emptyPayload)
    .expect(400)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.notOk(err, err || 'Passes supertest expect criteria');
      t.notOk(res.body.success, 'cb failed to log in with no submitted data');
    });
});
