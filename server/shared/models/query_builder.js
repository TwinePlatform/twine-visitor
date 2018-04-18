const { curry, pipe } = require('ramda');

/*
 * Query builder utilities
 *
 * Functions to build simple SELECT/INSERT/UPDATE queries
 */

/**
 * pg queryObject
 * @typedef {Object} QueryObject
 * @property {String} text - sql query
 * @property {Any[]} values - parameterised values
 */

/**
 * options
 * @typedef {Object} Options
 * @property {Object} where - { [column_name]: string }
 * @property {Object} between - { column: string, values: string [] }
 * @property {String} sort - column name to sort by
 * @property {Object} pagination - { offset: int }
 * @property {String} returning
 */

/**
 * Dependant on options adds where clause and values to query object
 * @param   {Options} options options object
 * @param   {QueryObject} queryObj
 * @returns {QueryObject}
 */
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

/**
 * Dependant on options adds between clause and values to query object
 * @param   {Options} options options object
 * @param   {QueryObject} queryObj
 * @returns {QueryObject}
 */
const addBetweenClause = curry((options, queryObj) => {
  const valuesOffset = queryObj.values.length + 1;

  if (options.between) {
    const betweenClause = `${
      options.between.column
    } BETWEEN $${valuesOffset} AND $${valuesOffset + 1}`;
    const joiner = options.where ? `AND` : `WHERE`;
    return {
      text: `${queryObj.text} ${joiner} ${betweenClause}`,
      values: [...queryObj.values, ...options.between.values],
    };
  }
  return queryObj;
});

/**
 * Dependant on options adds sort clause to query object
 * @param   {Options} options options object
 * @param   {QueryObject} queryObj
 * @returns {QueryObject}
 */
const addSortClause = curry((options, queryObj) => {
  if (options.sort) {
    return {
      text: `${queryObj.text} ORDER BY ${options.sort}`,
      values: [...queryObj.values],
    };
  }
  return queryObj;
});

/**
 * Dependant on options adds pagination clause and values to query object
 * @param   {Options} options options object
 * @param   {QueryObject} queryObj
 * @returns {QueryObject}
 */
const addPagination = curry((options, queryObj) => {
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

const addReturning = curry((options, queryObj) => {
  if (options.returning) {
    return {
      text: `${queryObj.text} RETURNING ${options.returning}`,
      values: [...queryObj.values],
    };
  }
  return queryObj;
});

/**
 * Generates SELECT query object with `text` and `value` fields
 * @param   {String}   table      Table name
 * @param   {String[]} columns    Columns to select
 * @param   {Options}  options    options object
 * @returns {QueryObject} queryObject
 */
const selectQuery = (table, columns, options) => {
  const cols = (options.pagination
    ? ['COUNT(*) OVER() AS full_count']
    : []
  ).concat(columns);
  const base = `SELECT ${cols.join(', ')} FROM ${table}`;
  const queryObject = { text: base, values: [] };

  const queryPipe = pipe(
    addWhereClause(options),
    addBetweenClause(options),
    addSortClause(options),
    addPagination(options)
  );

  return queryPipe(queryObject);
};

/**
 * Generates INSERT query object with `text` and `value` fields
 * @param   {String} table          Table name
 * @param   {Object} values         { column-name: value-to-insert }
 * @param   {String} [returning=''] Returning clause, raw
 * @returns {Query}                 { text: String, values: Array }
 */
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

/**
 * Generates UPDATE query object with `text` and `value` fields
 * @param   {String} table          Table name
 * @param   {Object} values         { column-name: value-to-insert }
 * @param   {Option} options        options object
 * @returns {QueryObject}           { text: String, values: Array }
 */
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
