const test = require('tape');
const request = require('supertest');
const app = require('../../react-backend/app');
const jwt = require('jsonwebtoken');

test('POST /api/user/name-from-scan | viable & registered hash', (t) => {
  const token = jwt.sign({ email: 'jinglis12@googlemail.com' }, process.env.SECRET);

  const successPayload = {
    user:
      '9fb59d630d2fb12f7478c56c5f1b2fff20e0dd7c9d3a260eee7308a8eb6cd955',
  };
  request(app)
    .post('/api/user/name-from-scan')
    .set('authorization', token)
    .send(successPayload)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.equal(res.body.fullname, 'james bond');
      t.end();
    });
});

test('POST /api/user/name-from-scan | non-viable hash ', (t) => {
  const token = jwt.sign({ email: 'jinglis12@googlemail.com' }, process.env.SECRET);

  const failPayload = {
    user: 'Im fairly sure, though not positive, that this is not a hash',
  };
  request(app)
    .post('/api/user/name-from-scan')
    .set('authorization', token)
    .send(failPayload)
    .expect(400)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.equal(res.body.fullname, 'Bad hash');
      t.end();
    });
});

test('POST /api/user/name-from-scan | user/hash not registered ', (t) => {
  const token = jwt.sign({ email: 'jinglis12@googlemail.com' }, process.env.SECRET);

  const failPayload = {
    user:
      '5e6188b3f09e0d58acfbe4171284dd10b69ea8a78189f7bb8c7d6fa983557492',
  };
  request(app)
    .post('/api/user/name-from-scan')
    .set('authorization', token)
    .send(failPayload)
    .expect(401)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.equal(
        res.body.fullname, 'there is no registered user');
      t.end();
    });
});
