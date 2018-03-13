const test = require('tape');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const createApp = require('../../../react-backend/app');
const { getConfig } = require('../../../config');

const config = getConfig(process.env.NODE_ENV);

test('POST /api/cb/feedback', tape => {
  const app = createApp(config);
  const dbConnection = app.get('client:psql');

  tape.test('POST /api/cb/feedback | successful payload', t => {
    const secret = app.get('cfg').session.standard_jwt_secret;
    const token = jwt.sign({ email: 'findmyfroggy@frogfinders.com' }, secret);
    const successPayload = {
      feedbackScore: -1,
    };

    request(app)
      .post('/api/cb/feedback')
      .set('authorization', token)
      .send(successPayload)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(async (err, res) => {
        t.notOk(err, err || 'Passes supertest expect criteria');
        t.ok(res.body.result, 'post to feedback returns a result');
        t.end();
      });
  });

  tape.test(
    'POST /api/cb/feedback | nonexistent cb email / bad payload throws server error',
    t => {
      const secret = app.get('cfg').session.standard_jwt_secret;
      const token = jwt.sign({ email: 'fakey@mcfake.com' }, secret);
      const badPayload = {
        feedbackScore: -1,
      };

      request(app)
        .post('/api/cb/feedback')
        .set('authorization', token)
        .send(badPayload)
        .expect(500)
        .expect('Content-Type', /text/)
        .end(async err => {
          t.notOk(err, err || 'Passes supertest expect criteria');
          t.end();
        });
    }
  );
  tape.test('POST /api/cb/feedback | teardown', t => dbConnection.end(t.end));
});
