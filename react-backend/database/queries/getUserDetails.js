const dbConnection = require('../dbConnection');

const getUserDetailsQuery = `
  SELECT *
  FROM users
  WHERE cb_id = $1 AND id = $2`;

const getUserDetails = (cbId, userId) =>
  new Promise((resolve, reject) => {
    dbConnection
      .query(getUserDetailsQuery, [cbId, userId])
      .then(res => {
        return resolve(res.rows);
      })
      .catch(reject);
  });

module.exports = getUserDetails;
