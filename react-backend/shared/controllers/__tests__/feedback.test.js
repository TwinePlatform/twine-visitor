const test = require('tape');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const createApp = require('../../../app');
const { getConfig } = require('../../../../config');

const config = getConfig(process.env.NODE_ENV);

test('GET /api/cb/feedback', tape => {
  const app = createApp(config);
  const dbConnection = app.get('client:psql');

  tape.test('GET /api/cb/feedback | successful query with null params', t => {
    const cbAdminJwtSecret = app.get('cfg').session.cb_admin_jwt_secret;
    const token = jwt.sign(
      { email: 'findmyfroggy@frogfinders.com' },
      cbAdminJwtSecret
    );
    const successQuery = {
      since: null,
      until: null,
    };

    request(app)
      .get('/api/cb/feedback')
      .set('authorization', token)
      .query(successQuery)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(async (err, res) => {
        t.notOk(err, err || 'Passes supertest expect criteria');
        t.ok(res.body.result, 'get to feedback returns a result');
        t.end();
      });
  });

  tape.test('GET /api/cb/feedback | successful query with date', t => {
    const cbAdminJwtSecret = app.get('cfg').session.cb_admin_jwt_secret;
    const token = jwt.sign(
      { email: 'findmyfroggy@frogfinders.com' },
      cbAdminJwtSecret
    );
    const successQuery = {
      since: '2018-03-25T12:00:00.000+03:00',
      until: null,
    };

    request(app)
      .get('/api/cb/feedback')
      .set('authorization', token)
      .query(successQuery)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(async (err, res) => {
        t.notOk(err, err || 'Passes supertest expect criteria');
        t.ok(res.body.result, 'get to feedback returns a result');
        t.end();
      });
  });

  tape.test('GET /api/cb/feedback | bad query', t => {
    const cbAdminJwtSecret = app.get('cfg').session.cb_admin_jwt_secret;
    const token = jwt.sign(
      { email: 'findmyfroggy@frogfinders.com' },
      cbAdminJwtSecret
    );
    const badQuery = {
      since: 'not-a-date',
      until: null,
    };

    request(app)
      .get('/api/cb/feedback')
      .set('authorization', token)
      .query(badQuery)
      .expect(400)
      .expect('Content-Type', /json/)
      .end(async (err, res) => {
        t.deepEqual(
          res.body.validation,
          { since: ['must be a number of milliseconds or valid date string'] },
          'Empty payload returns error response from Joi'
        );
        t.notOk(err, err || 'Passes supertest expect criteria');
        t.end();
      });
  });
  tape.test('GET /api/cb/feedback | teardown', t => dbConnection.end(t.end));
});

test('POST /api/cb/feedback', tape => {
  const app = createApp(config);
  const dbConnection = app.get('client:psql');

  tape.test('POST /api/cb/feedback | successful payload', t => {
    const secret = app.get('cfg').session.standard_jwt_secret;
    const token = jwt.sign({ email: 'findmyfroggy@frogfinders.com' }, secret);
    const successPayload = {
      query: { feedbackScore: -1 },
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

  tape.test('POST /api/cb/feedback | bad payload', t => {
    const secret = app.get('cfg').session.standard_jwt_secret;
    const token = jwt.sign({ email: 'findmyfroggy@frogfinders.com' }, secret);
    const badPayload = { query: { feedbackScore: 'lol' } };

    request(app)
      .post('/api/cb/feedback')
      .set('authorization', token)
      .send(badPayload)
      .expect(400)
      .expect('Content-Type', /json/)
      .end(async (err, res) => {
        t.deepEqual(
          res.body.validation,
          { feedbackScore: ['must be a number'] },
          'Bad payload returns error response from Joi'
        );
        t.notOk(err, err || 'Passes supertest expect criteria');
        t.end();
      });
  });
  tape.test('POST /api/cb/feedback | teardown', t => dbConnection.end(t.end));
});
