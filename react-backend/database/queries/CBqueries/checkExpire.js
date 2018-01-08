const dbConnection = require('../../dbConnection');

const checkTokenquery =
  'SELECT EXISTS(SELECT 1 FROM cbusiness WHERE token = $1 AND tokenexpire >= $2)';

const expire = Date.now();
const checkToken = token =>
  new Promise((resolve, reject) => {
    dbConnection.query(checkTokenquery, [token, expire], (err, res) => {
      if (err) {
        return reject('There was an error with the checkExpire query');;
      }
      resolve(res.rows[0].exists);
    });
  });

module.exports = checkToken;
