const dbConnection = require('../../dbConnection');

const insertNewPassword =
  'UPDATE cbusiness SET hash_pwd = $1, tokenexpire = 0 WHERE token = $2';

const putNewPassword = (password, token) =>
  dbConnection.query(insertNewPassword, [password, token]);

module.exports = putNewPassword;
