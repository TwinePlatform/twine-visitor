const dbConnection = require('../dbConnection');

const getUserDetailsQuery = `
  SELECT *
  FROM users
  WHERE cb_id = $1 AND id = $2`;

const getUserDetails = (cbId, userId) =>
  dbConnection.query(getUserDetailsQuery, [cbId, userId]).then(res => res.rows);

module.exports = getUserDetails;
