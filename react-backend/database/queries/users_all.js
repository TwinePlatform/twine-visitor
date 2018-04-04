const { selectQuery } = require('../../shared/models/query_builder');

const getUserList = (dbConnection, cbId) =>
  dbConnection.query(
    selectQuery(
      'users',
      ['id', 'fullName AS name', 'sex AS gender', 'yearofbirth AS yob', 'email', 'date AS visit_date'],
      { cb_id: cbId }
    )
  )
    .then(res => res.rows);

module.exports = getUserList;
