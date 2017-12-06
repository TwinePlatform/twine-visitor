const dbConnection = require('../../dbConnection');

const insertToken =
  'UPDATE cbusiness SET token = $1, tokenExpire = $2 WHERE email = $3';

const putTokenData = (token, tokenExpire, formEmail, cb) => {
  dbConnection.query(
    insertToken,
    [token, tokenExpire, formEmail],
    (err, res) => {
      if (err) {
        return cb(err);
      }

      cb(null, res);
    }
  );
};

module.exports = putTokenData;
