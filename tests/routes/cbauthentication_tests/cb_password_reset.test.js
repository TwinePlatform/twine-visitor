const test = require('tape');
const request = require('supertest');
const createApp = require('../../../react-backend/app');
const refreshDB = require('../../../db/scripts/refresh');
const { getConfig } = require('../../../config');

const config = getConfig(process.env.NODE_ENV);


test('POST api/cb/pwd/reset | token creation successful', async (t) => {
  await refreshDB();
  const app = createApp(config);
  const dbConnection = app.get('client:psql');

  const successPayload = { formEmail: 'findmyfroggy@frogfinders.com' };
  request(app)
    .post('/api/cb/pwd/reset')
    .send(successPayload)
    .expect(200)
    .end(async (err) => {
      t.notOk(err, err || 'Passes supertest expect criteria');
      try {
        const getTokenFromDb = await dbConnection.query(
          "SELECT * FROM cbusiness WHERE (token IS NOT NULL) AND email = 'findmyfroggy@frogfinders.com'",
        );
        t.ok(getTokenFromDb.rows.length, 'route successfully created a token in db');
        t.end();
      } catch (error) {
        t.end(error);
      }
    });
});

test('POST api/cb/pwd/reset | token creation unsuccessful', async (t) => {
  await refreshDB();

  const app = createApp(config);

  const unsuccessPayload = { formEmail: 'idont@exist.com' };

  request(app)
    .post('/api/cb/pwd/reset')
    .send(unsuccessPayload)
    .expect(400)
    .end((err, res) => {
      t.notOk(err, err || 'Passes supertest expect criteria');
      t.notOk(res.body, 'Non existing email returns false');
      t.end();
    });
});
