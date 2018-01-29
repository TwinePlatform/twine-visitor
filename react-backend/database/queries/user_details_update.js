const dbConnection = require('../dbConnection');

const putNewUserDetailsQuery = `
  UPDATE users
  SET fullname = $3, sex = $4, yearofbirth = $5, email = $6
  WHERE id = $2 AND cb_id = $1
  RETURNING *`;

const putNewUserDetails = (cbId, userId, fullName, sex, yearOfBirth, email) =>
  new Promise((resolve, reject) => {
    dbConnection
      .query(putNewUserDetailsQuery, [
        cbId,
        userId,
        fullName,
        sex,
        yearOfBirth,
        email,
      ])
      .then(res => {
        if (!res.rowCount) return reject('No user found');
        return resolve(res.rows[0]);
      })
      .catch(reject);
  });

module.exports = putNewUserDetails;
