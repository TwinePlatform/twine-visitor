const { curry, pipe } = require('ramda');

/*
  Query builder utilities

  Functions to build SELECT/INSERT/UPDATE queries dynamically

  Complex queries including INNER JOIN, WHERE, BETWEEN, SORT, OFFSET and RETURNING clauses can be
  constructed by specifying options, as defined by the `Options` type definition below.

  SqlQuery =
    {
      text: String,
      values: [ a ]
    }

  Options =
    {
      where: { <column-name>: <value> },
      between: { column: String, values: [ Int ] },
      sort: String,
      pagination: { offset: Int },
      returning: String
    }
*/

// addInnerJoinClause :: Options -> SqlQuery -> SqlQuery
const addInnerJoinClause = curry(({ innerJoin }, queryObj) => {
  if (innerJoin) {
    const innerJoinClause = `${Object.keys(innerJoin)
      .map((k) => `INNER JOIN ${k} ON ${innerJoin[k][0]}=${innerJoin[k][1]}`)
      .join(' ')}`;

    return {
      text: `${queryObj.text} ${innerJoinClause}`,
      values: [...queryObj.values],
    };
  }
  return queryObj;
});

// addWhereClause :: Options -> SqlQuery -> SqlQuery
const addWhereClause = curry((options, queryObj) => {
  const valuesOffset = queryObj.values.length;

  if (options.where) {
    const whereClause = `${Object.keys(options.where)
      .map((k, i) => `${k}=$${i + 1 + valuesOffset}`)
      .join(' AND ')}`;

    return {
      text: `${queryObj.text} WHERE ${whereClause}`,
      values: [...queryObj.values, ...Object.values(options.where)],
    };
  }
  return queryObj;
});

// addBetweenClause :: Options -> SqlQuery -> SqlQuery
const addBetweenClause = curry((options, queryObj) => {
  const valuesOffset = queryObj.values.length + 1;

  if (options.between) {
    const betweenClause = `${
      options.between.column
    } BETWEEN $${valuesOffset} AND $${valuesOffset + 1}`;
    const joiner = options.where ? 'AND' : 'WHERE';
    return {
      text: `${queryObj.text} ${joiner} ${betweenClause}`,
      values: [...queryObj.values, ...options.between.values],
    };
  }
  return queryObj;
});

// addSortClause :: Options -> SqlQuery -> SqlQuery
const addSortClause = curry((options, queryObj) => {
  if (options.sort) {
    return {
      text: `${queryObj.text} ORDER BY ${options.sort}`,
      values: [...queryObj.values],
    };
  }
  return queryObj;
});

// addPaginationClause :: Options -> SqlQuery -> SqlQuery
const addPaginationClause = curry((options, queryObj) => {
  const valuesOffset = queryObj.values.length + 1;

  if (options.pagination) {
    const { offset } = options.pagination;

    return {
      text: `${queryObj.text} LIMIT 10 OFFSET $${valuesOffset}`,
      values: [...queryObj.values, offset],
    };
  }
  return queryObj;
});

// addReturningClause :: Options -> SqlQuery -> SqlQuery
const addReturning = curry((options, queryObj) => {
  if (options.returning) {
    return {
      text: `${queryObj.text} RETURNING ${options.returning}`,
      values: [...queryObj.values],
    };
  }
  return queryObj;
});

// selectQuery:: ( String, [ String ], Options ) -> SqlQuery
const selectQuery = (table, columns, options) => {
  const cols = (options.pagination
    ? ['COUNT(*) OVER() AS full_count']
    : []
  ).concat(columns);
  const base = `SELECT ${cols.join(', ')} FROM ${table}`;
  const queryObject = { text: base, values: [] };

  const queryPipe = pipe(
    addInnerJoinClause(options),
    addWhereClause(options),
    addBetweenClause(options),
    addSortClause(options),
    addPaginationClause(options)
  );

  return queryPipe(queryObject);
};

// insertQuery :: ( String, { <column-name>: <value> }, String ) -> SqlQuery
const insertQuery = (table, values, returning = '') => {
  const base = `INSERT INTO ${table}`;
  const keys = Object.keys(values);
  const columns = `(${keys.join(', ')})`;
  const vals = `(${keys.map((_, i) => `$${i + 1}`).join(', ')})`;
  const suffix = returning ? `RETURNING ${returning}` : '';

  return {
    text: `${base} ${columns} VALUES ${vals} ${suffix}`.trim(),
    values: Object.values(values),
  };
};

// updateQuery :: ( String, { <column-name>: <value> }, Options ) -> SqlQuery
const updateQuery = (table, values, options) => {
  const base = `UPDATE ${table} SET`;
  const keys = Object.keys(values);
  const set = keys
    .reduce((acc, key, i) => acc.concat(`${key}=$${i + 1}`), [])
    .join(', ');

  const queryObject = {
    text: `${base} ${set}`.trim(),
    values: Object.values(values),
  };

  const queryPipe = pipe(addWhereClause(options), addReturning(options));

  return queryPipe(queryObject);
};

module.exports = {
  selectQuery,
  insertQuery,
  updateQuery,
};
