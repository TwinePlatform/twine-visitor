const test = require('tape');
const { selectQuery, insertQuery, updateQuery } = require('../query_builder');

test('Query Builder', suite => {
  [
    {
      name: 'two columns, no where',
      table: 'foo',
      columns: ['bar', 'qux'],
      options: null,
      expected: { text: 'SELECT bar, qux FROM foo', values: [] },
    },
    {
      name: 'single column, single where',
      table: 'baz',
      columns: ['foo'],
      options: { where: { id: 1 } },
      expected: { text: 'SELECT foo FROM baz WHERE id=$1', values: [1] },
    },
    {
      name: 'single column, two where',
      table: 'baz',
      columns: ['foo'],
      options: { where: { id: 1, qux: 'lol' } },
      expected: {
        text: 'SELECT foo FROM baz WHERE id=$1 AND qux=$2',
        values: [1, 'lol'],
      },
    },
    {
      name: 'single column, three where',
      table: 'baz',
      columns: ['foo'],
      options: { where: { id: 1, wibble: 'wobble', wiggle: 'jiggle' } },
      expected: {
        text: 'SELECT foo FROM baz WHERE id=$1 AND wibble=$2 AND wiggle=$3',
        values: [1, 'wobble', 'jiggle'],
      },
    },
  ].forEach(({ name, table, columns, options, expected }) => {
    suite.test(`selectQuery | ${name}`, t => {
      const args = [table, columns].concat(options || {});
      const query = selectQuery(...args);

      t.deepEqual(query, expected, 'Select query correctly formatted');
      t.end();
    });
  });

  [
    {
      name: 'simple',
      table: 'baz',
      values: { foo: 1, bar: 2 },
      returning: null,
      expected: {
        text: 'INSERT INTO baz (foo, bar) VALUES ($1, $2)',
        values: [1, 2],
      },
    },
    {
      name: 'with returning statement',
      table: 'haz',
      values: { max: 'lol', bax: 'woo' },
      returning: '*',
      expected: {
        text: 'INSERT INTO haz (max, bax) VALUES ($1, $2) RETURNING *',
        values: ['lol', 'woo'],
      },
    },
  ].forEach(({ name, table, values, returning, expected }) => {
    suite.test(`insertQuery | ${name}`, t => {
      const args = [table, values].concat(returning || []);
      const query = insertQuery(...args);

      t.deepEqual(query, expected, 'Insert query correctly formatted');
      t.end();
    });
  });

  [
    {
      name: 'simple',
      table: 'haz',
      values: { max: 'lol', bax: 'woo' },
      options: { where: null, returning: null },
      expected: {
        text: 'UPDATE haz SET max=$1, bax=$2',
        values: ['lol', 'woo'],
      },
    },
    {
      name: 'w/ WHERE clause',
      table: 'raz',
      values: { ma: 'taz' },
      options: { where: { razzle: 'dazzle', lol: 'cat' }, returning: null },
      expected: {
        text: 'UPDATE raz SET ma=$1 WHERE razzle=$2 AND lol=$3',
        values: ['taz', 'dazzle', 'cat'],
      },
    },
    {
      name: 'w/ WHERE clause and RETURNING',
      table: 'shaz',
      values: { ama: 'taz' },
      options: { where: { wig: 'wam' }, returning: '*' },
      expected: {
        text: 'UPDATE shaz SET ama=$1 WHERE wig=$2 RETURNING *',
        values: ['taz', 'wam'],
      },
    },
  ].forEach(({ name, table, values, options, expected }) => {
    suite.test(`updateQuery | ${name}`, t => {
      const args = [table, values].concat(options || {});
      const query = updateQuery(...args);

      t.deepEqual(query, expected, 'Update query correctly formatted');
      t.end();
    });
  });
});
