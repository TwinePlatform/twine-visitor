const test = require('tape');
const request = require('supertest');
const app = require('../../react-backend/app');

test('POST /api/user/name-from-scan | viable & registered hash', (t) => {
  const successPayload = {
    hashToCheck:
      '9fb59d630d2fb12f7478c56c5f1b2fff20e0dd7c9d3a260eee7308a8eb6cd955',
  };
  request(app)
    .post('/api/user/name-from-scan')
    .send(successPayload)
    .expect(200)
    .expect('Content-Type', /json/)
    .expect(res => res.json().fullname)
    .end((err, res) => {
      t.ok(res === 'james bond', 'Hash is viable and found in database');
      t.end();
    });
});

test('POST /api/user/name-from-scan | non-viable hash ', (t) => {
  const failPayload = {
    hashToCheck: 'Im faily sure, though not positive, that this is not a hash',
  };
  request(app)
    .post('/api/user/name-from-scan')
    .send(failPayload)
    .expect(400)
    .expect('Content-Type', /json/)
    .expect(res => res.json().fullname)
    .end((err, res) => {
      t.notOk(res === 'Bad hash', 'Validation returned output of "Bad Hash"');
      t.end();
    });
});

test('POST /api/user/name-from-scan | user/hash not registered ', (t) => {
  const failPayload = {
    hashToCheck:
      '5e6188b3f09e0d58acfbe4171284dd10b69ea8a78189f7bb8c7d6fa983557492',
  };
  request(app)
    .post('/api/user/name-from-scan')
    .send(failPayload)
    .expect(401)
    .expect('Content-Type', /json/)
    .expect(res => res.json().fullname)
    .end((err, res) => {
      t.notOk(
        res === 'there is no registered user',
        'There is no user registered with that hash"'
      );
      t.end();
    });
});
