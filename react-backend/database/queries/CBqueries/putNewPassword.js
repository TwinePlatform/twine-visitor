const dbConnection = require('../../dbConnection');

const insertNewPassword =
  'UPDATE cbusiness SET hash_pwd = $1, tokenexpire = 0 WHERE token = $2';

const putNewPassword = (password, token, cb) => {
  dbConnection.query(insertNewPassword, [password, token], (err, res) => {
    if (err) {
      return cb(err);
    }

    cb(null, res);
  });
};

module.exports = putNewPassword;
