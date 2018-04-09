const insertNewPassword =
  'UPDATE cbusiness SET hash_pwd = $1, tokenexpire = 0 WHERE token = $2';

const pwdChange = (dbConnection, password, token) =>
  dbConnection.query(insertNewPassword, [password, token]);

module.exports = pwdChange;
