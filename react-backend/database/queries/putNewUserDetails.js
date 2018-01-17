const dbConnection = require('../dbConnection');

const putNewUserDetailsQuery =
  'UPDATE users SET users.fullname = $3, users.sex = $4, users.yearofbirth = $5, users.email = $6 WHERE users.id = $2 AND users.cb_id = $1';

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
        if (res.rowCount === 0) {
          return reject('No user found');
        }
        return resolve(res.rows);
      })
      .catch(reject);
  });

module.exports = putNewUserDetails;
