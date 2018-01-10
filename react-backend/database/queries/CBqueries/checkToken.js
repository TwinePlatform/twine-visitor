const dbConnection = require('../../dbConnection');

const checkTokenquery =
  'SELECT EXISTS(SELECT 1 FROM cbusiness WHERE token = $1)';

const checkToken = token =>
  new Promise((resolve, reject) => {
    dbConnection
      .query(checkTokenquery, [token])
      .then(result => {
        resolve(result.rows[0].exists);
      })
      .catch(error => {
        reject('There was an error with the checkToken query');
      });
  });
module.exports = checkToken;
