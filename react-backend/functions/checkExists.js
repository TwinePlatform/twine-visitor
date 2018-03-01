const checkToken = require('../database/queries/cb/pwd_token_check');

module.exports = (dbConnection, token) => new Promise((resolve, reject) => {
    checkToken(dbConnection, token, (error, result) => {
      if (error) {
        console.log('error from checkToken ', error);
        reject(error);
      } else {
        resolve(result.rows[0].exists);
      }
    });
  });
