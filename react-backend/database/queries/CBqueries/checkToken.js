const dbConnection = require('../../dbConnection');

const checkTokenquery =
  'SELECT EXISTS(SELECT 1 FROM cbusiness WHERE token = $1)';
const checkToken = (token, cb) => {
  console.log('This is checkToken query');
  dbConnection.query(checkTokenquery, [token], (err, res) => {
    if (err) {
      return cb(err);
    }
    cb(null, res);
  });
};

module.exports = checkToken;
