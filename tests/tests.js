const supertest = require('supertest');
const test = require('tape');

test('tape is working', (t) => {
  t.equals(1, 1, 'one equals one');
  t.end();
});
