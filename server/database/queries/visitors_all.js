const { selectQuery } = require('../../shared/models/query_builder');

const getAllVisitors = (dbConnection, options) => {
  if (!options) return [];

  return dbConnection
    .query(
      selectQuery(
        'users',
        [
          'visits.id AS visit_id',
          'users.id AS visitor_id',
          'users.fullName AS visitor_name',
          'users.sex AS gender',
          'users.yearofbirth AS yob',
          'activities.name AS activity',
          'visits.date AS visit_date',
        ],
        options
      )
    )
    .then(res => res.rows);
};

module.exports = getAllVisitors;
