const checkToken = require('../database/queries/CBqueries/checkToken');

module.exports = token => {
  return new Promise((resolve, reject) => {
    checkToken(token, (error, result) => {
      if (error) {
        console.log('error from checkToken ', error);
        reject(error);
      } else {
        console.log('checkExists: ', result.rows[0].exists);
        resolve(result.rows[0].exists);
      }
    });
  });
};
