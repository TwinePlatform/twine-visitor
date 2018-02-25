const test = require('tape');
const request = require('supertest');
const app = require('../../../react-backend/app');
const dbConnection = require('../../../react-backend/database/dbConnection');
const rebuild = require('../../../react-backend/database/database_rebuild');

test('POST api/cb/pwd/reset | token creation successful', async (t) => {
  await rebuild();

  const successPayload = { formEmail: 'findmyfroggy@frogfinders.com' };
  request(app)
    .post('/api/cb/pwd/reset')
    .send(successPayload)
    .expect(200)
    .end(async () => {
      try {
        const getTokenFromDb = await dbConnection.query(
          "SELECT * FROM cbusiness WHERE (token IS NOT NULL) AND email = 'findmyfroggy@frogfinders.com'",
        );
        t.ok(getTokenFromDb.rows, 'route successfully created a token in db');
        t.end();
      } catch (error) {
        t.fail('Test query broke');
        t.end();
      }
    });
});

test('POST api/cb/pwd/reset | token creation unsuccessful', async (t) => {
  await rebuild();

  const unsuccessPayload = { formEmail: 'idont@exist.com' };
  request(app)
    .post('/api/cb/pwd/reset')
    .send(unsuccessPayload)
    .expect(400)
    .end((err, res) => {
      t.notOk(res.body, 'Non existing email returns false');
      t.end();
    });
});
