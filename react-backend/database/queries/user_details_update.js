const putNewUserDetailsQuery = `
  UPDATE users
  SET fullname = $3, sex = $4, yearofbirth = $5, email = $6
  WHERE id = $2 AND cb_id = $1
  RETURNING *`;

const putNewUserDetails = (dbConnection, cbId, userId, fullName, sex, yearOfBirth, email) =>
  dbConnection
    .query(putNewUserDetailsQuery, [
      cbId,
      userId,
      fullName,
      sex,
      yearOfBirth,
      email,
    ])
    .then(
      res =>
        res.rowCount ? res.rows[0] : Promise.reject(new Error('No user found'))
    );

module.exports = putNewUserDetails;
