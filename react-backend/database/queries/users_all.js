const dbConnection = require('../dbConnection');

const getAllUsersQuery = `
  SELECT users.id, users.fullName, users.sex, users.yearofbirth, users.email, users.date
  FROM users
  WHERE users.cb_id = $1`;

const getUserList = cbId =>
  dbConnection.query(getAllUsersQuery, [cbId]).then(res => res.rows);

module.exports = getUserList;
