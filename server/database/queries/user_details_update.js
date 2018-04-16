const { updateQuery } = require('../../shared/models/query_builder');

const putNewUserDetails = async (dbConnection, data, options) => {
  const query = updateQuery('users', data, options);

  const res = await dbConnection.query(query);

  return res.rows[0] || null;
};

module.exports = putNewUserDetails;
