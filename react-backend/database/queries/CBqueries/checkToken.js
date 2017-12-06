const dbConnection = require('../../dbConnection');

const expire = Date.now();

const checkTokenquery =
  'SELECT EXISTS(SELECT 1 FROM cbusiness WHERE token = $1 AND tokenexpire >= $2)';

const checkToken = (token, cb) => {
  dbConnection.query(checkTokenquery, [token, expire], (err, res) => {
    if (err) {
      return cb(err);
    }
    cb(null, res);
  });
};

module.exports = checkToken;
