const tape = require('tape');
const nock = require('nock');
const fs = require('fs');
const path = require('path');
const pdfGen = require('../pdfgenerator');
const qrGen = require('../qrcodemaker');


const ROOT = path.resolve(__dirname, '..', '..', '..');

const img = fs.readFileSync(
  path.resolve(ROOT, 'client', 'src', 'shared', 'assets', 'images', 'qrcodelogo.png')
);

tape('PDF Generator', (suite) => {
  const URL = 'http://fake-img-url.com';
  const api = nock(URL);

  suite.test('Successful generation with URL', async (t) => {
    try {
      const imgURL = `${URL}/foo`;

      api
        .get('/foo')
        .reply(200, img);

      const qrCode = await qrGen('foobarfakestring');
      const result = await pdfGen(qrCode, imgURL);

      t.equal(typeof result, 'string');
      t.end();

    } catch (error) {
      t.end(error);

    }
  });

  suite.test('Successful generation with default', async (t) => {
    try {
      const qrCode = await qrGen('foobarfakestring');
      const result = await pdfGen(qrCode);

      t.equal(typeof result, 'string');
      t.end();
    } catch (error) {
      t.end(error);
    }
  });

  suite.test('Teardown', (t) => {
    nock.cleanAll();
    t.end();
  });
});
