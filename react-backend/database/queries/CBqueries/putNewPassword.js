const dbConnection = require('../../dbConnection');

const insertNewPassword =
  'UPDATE cbusiness SET hash_pwd = $1, tokenexpire = 0 WHERE token = $2';

const putNewPassword = (password, token) => {
  new Promise((resolve, reject) => {


    dbConnection.query(insertNewPassword, [password, token], (err, res) => {
      if (err) {
        return reject('There was an error with the putNewPassword query');
      }

      resolve(res);
    });
  });
};

module.exports = putNewPassword;
