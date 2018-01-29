const checkToken = require('../database/queries/cb/pwd_token_check');

module.exports = token => new Promise((resolve, reject) => {
    checkToken(token, (error, result) => {
      if (error) {
        console.log('error from checkToken ', error);
        reject(error);
      } else {
        resolve(result.rows[0].exists);
      }
    });
  });
