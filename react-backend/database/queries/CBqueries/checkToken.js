const dbConnection = require('../../dbConnection');

const checkTokenquery =
  'SELECT EXISTS(SELECT 1 FROM cbusiness WHERE token = $1)';
const checkToken = token =>
  new Promise((resolve, reject) => {
    dbConnection.query(checkTokenquery, [token], (err, res) => {
      if (err) {
        return reject('There was an error with the checkToken query');
      }
      resolve(res.rows[0].exists);
    });
  });

module.exports = checkToken;
