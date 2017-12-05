const dbConnection = require('../../dbConnection');

const insertToken =
  'UPDATE cbusiness SET token = (token), tokenExpire = (tokenExpire) WHERE email = (formEmail) VALUES ($2, $3, $1)';

const putCBData = (token, tokenExpire, formEmail, cb) => {
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

module.exports = putCBData;
