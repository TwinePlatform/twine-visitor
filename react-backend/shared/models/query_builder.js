/*
 * Query builder utilities
 *
 * Functions to build simple SELECT/INSERT/UPDATE queries
 */


/**
 * Generates WHERE clause to be appended onto query string,
 * as well as values to be substituted into parameterised query
 * @param   {Object} query      Specifies the constraint
 * @param   {Number} [offset=0] Offset for "$x" placeholders
 * @returns {[String, Any[]]}   2-element array of [query, values]
 */
const whereClause = (query, offset = 0) =>
  [
    `WHERE ${Object.keys(query).map((k, i) => `${k}=$${i + 1 + offset}`).join(' AND ')}`,
    Object.values(query),
  ];


/**
 * Generates SELECT query object with `text` and `value` fields
 * @param   {String}   table      Table name
 * @param   {String[]} columns    Columns to select
 * @param   {Object}   [where={}] Constraint object
 * @returns {Query}               { text: String, values: Array }
 */
const selectQuery = (table, columns, where = {}) => {
  const base = `SELECT ${columns.join(', ')} FROM ${table}`;
  const hasWhere = Object.keys(where).length > 0;

  if (hasWhere) {
    const [whereText, whereVals] = whereClause(where);
    return { text: `${base} ${whereText}`.trim(), values: whereVals };
  }

  return { text: base };
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

  return { text: `${base} ${columns} VALUES ${vals} ${suffix}`.trim(), values: Object.values(values) };
};


/**
 * Generates UPDATE query object with `text` and `value` fields
 * @param   {String} table          Table name
 * @param   {Object} values         { column-name: value-to-insert }
 * @param   {Object} [where={}]     Constraint object
 * @param   {String} [returning=''] Returning clause, raw
 * @returns {Query}                 { text: String, values: Array }
 */
const updateQuery = (table, values, where = {}, returning = '') => {
  const suffix = returning ? `RETURNING ${returning}` : '';
  const base = `UPDATE ${table} SET`;
  const keys = Object.keys(values);
  const hasWhere = Object.keys(where).length > 0;
  const set = keys
    .reduce((acc, key, i) => acc.concat(`${key}=$${i + 1}`), [])
    .join(', ');

  if (hasWhere) {
    const [whereText, whereVals] = whereClause(where, keys.length);
    return {
      text: `${base} ${set} ${whereText} ${suffix}`.trim(),
      values: Object.values(values).concat(whereVals),
    };
  }

  return { text: `${base} ${set} ${suffix}`.trim(), values: Object.values(values) };
};


module.exports = {
  selectQuery,
  insertQuery,
  updateQuery,
};
