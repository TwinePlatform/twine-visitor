const checkToken = require('../database/queries/cb/pwd_token_check');

module.exports = (client, token) => new Promise((resolve, reject) => {
    checkToken(client, token, (error, result) => {
      if (error) {
        console.log('error from checkToken ', error);
        reject(error);
      } else {
        resolve(result.rows[0].exists);
      }
    });
  });
