const test = require('tape');
const request = require('supertest');
const nock = require('nock');
const createApp = require('../../../app');
const { refresh: refreshDB } = require('../../../../db/scripts');
const { getConfig } = require('../../../../config');

const config = getConfig(process.env.NODE_ENV);


test('POST api/cb/pwd/reset | token creation successful', async (t) => {
  await refreshDB();
  const app = createApp(config);
  const dbConnection = app.get('client:psql');
  const successPayload = { email: 'findmyfroggy@frogfinders.com' };

  nock('https://api.postmarkapp.com')
    .post('/email/withTemplate')
    .reply(200, {})
    .post('/email/batch')
    .reply(200, {});

  request(app)
    .post('/api/cb/pwd/reset')
    .send(successPayload)
    .expect(200)
    .end(async (err, res) => {
      t.notOk(err, err || 'Passes supertest expect criteria');
      t.deepEqual(res.body, { result: null }, 'Empty successful response body');

      try {
        const records = await dbConnection.query(`
          SELECT * FROM cbusiness
          WHERE (token IS NOT NULL)
          AND email='findmyfroggy@frogfinders.com'
        `);
        t.ok(records.rows.length, 'route successfully created a token in db');
        t.end();

      } catch (error) {
        t.end(error);

      } finally {
        dbConnection.end();
      }
    });
});

test('POST api/cb/pwd/reset | token creation unsuccessful', async (t) => {
  await refreshDB();

  const app = createApp(config);
  const dbConnection = app.get('client:psql');

  const unsuccessPayload = { email: 'idont@exist.com' };

  request(app)
    .post('/api/cb/pwd/reset')
    .send(unsuccessPayload)
    .expect(401)
    .end((err, res) => {
      t.notOk(err, err || 'Passes supertest expect criteria');
      t.deepEqual(res.body, { result: null, error: 'Email not recognised' }, 'Non-existent email');
      dbConnection.end(t.end);
    });
});
