const test = require('tape');
const fs = require('fs');
const path = require('path');
const { readConfig, validateConfig, DEVELOPMENT, TESTING, PRODUCTION } = require('..');


test(`Config | readConfig | ${DEVELOPMENT} | undefined path`, (t) => {
  const config = readConfig(DEVELOPMENT);

  t.deepEqual(
    config.web,
    { port: 4000, host: 'localhost', tls: null },
    'Web config should be configured for the dev environment'
  );
  t.end();
});

test(`Config | readConfig | ${TESTING} | undefined path`, (t) => {
  const config = readConfig(TESTING);

  t.deepEqual(
    config.web,
    { port: 4001, host: 'localhost', tls: null },
    'Web config should be configured for the test environment'
  );
  t.end();
});

test(`Config | readConfig | ${PRODUCTION} | undefined path`, (t) => {
  const config = readConfig(PRODUCTION);

  t.deepEqual(
    config.web,
    { port: 4002, host: 'localhost', tls: null },
    'Web config should be configured for the prod environment'
  );
  t.end();
});

test(`Config | readConfig | ${DEVELOPMENT} | defined path`, (t) => {
  const fpath = path.join(__dirname, 'foo.json');

  fs.writeFileSync(fpath, JSON.stringify({ web: { port: 1000 } }));

  const config = readConfig(DEVELOPMENT, fpath);

  t.deepEqual(
    config.web,
    { port: 1000, host: 'localhost', tls: null },
    'Web config should be overridden by the given file'
  );

  fs.unlinkSync(fpath);

  t.end();
});

test(`Config | readConfig | ${DEVELOPMENT} | without SSL`, (t) => {
  const temp = process.env.DATABASE_URL_DEV;
  process.env.DATABASE_URL_DEV = temp.replace('ssl=true', '');

  const config = readConfig(DEVELOPMENT);

  t.deepEqual(config.psql.ssl, false, 'SSL connection should be disabled');

  process.env.DATABASE_URL_DEV = temp;
  t.end();
});

test(`Config | readConfig | ${DEVELOPMENT} | with SSL`, (t) => {
  const temp = process.env.DATABASE_URL_DEV;
  process.env.DATABASE_URL_DEV = `${temp.replace(/\?.*/, '')}?ssl=true`;

  const config = readConfig(DEVELOPMENT);

  t.deepEqual(config.psql.ssl, true, 'SSL connection should be enabled');

  process.env.DATABASE_URL_DEV = temp;
  t.end();
});

test('Config | validateConfig | valid config', (t) => {
  const cfg = {
    env: DEVELOPMENT,
    web: {
      host: 'localhost',
      port: 1000,
      tls: null,
    },
    psql: {
      host: 'localhost',
      port: 5432,
      database: 'postgres',
      user: 'foo',
    },
    email: {
      postmark_key: 'hello',
      twine_email: 'visitor@twineplatform.org',
    },
    session: {
      standard_jwt_secret: 'secretstring20202020',
      cb_admin_jwt_secret: 'secretstring20202020',
      hmac_secret: 'secretstringagain202020',
      ttl: 108000000,
    },
  };

  t.doesNotThrow(() => validateConfig(cfg));
  t.end();
});

test('Config | validateConfig | invalid config', (t) => {
  const cfg = {
    env: DEVELOPMENT,
    web: {
      host: 'localhost',
      port: 1000,
      tls: null,
    },
    psql: {
      host: 'localhost',
      port: 5432,
      database: 'postgres',
      user: 'foo',
    },
    email: {
      postmark_key: null,
      twine_email: null,
    },
    session: {
      standard_jwt_secret: null,
      cb_admin_jwt_secret: null,
      hmac_secret: null,
      ttl: 108000000,
    },
  };

  t.throws(() => validateConfig(cfg));
  t.end();
});
