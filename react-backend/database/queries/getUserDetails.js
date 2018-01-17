const dbConnection = require('../dbConnection');

const getUserDetailsQuery = `
  SELECT users.fullname, users.sex, users.yearofbirth, users.email, users.date, users.hash
  FROM users 
  WHERE users.cb_id = $1 AND users.id = $2`;

const getUserDetails = (cbId, userId) =>
  new Promise((resolve, reject) => {
    dbConnection
      .query(getUserDetailsQuery, [cbId, userId])
      .then(res => {
        if (res.rowCount === 0) {
          return reject('No user found');
        }
        return resolve(res.rows);
      })
      .catch(reject);
  });

module.exports = getUserDetails;
