const checkExpire = require('../database/queries/CBqueries/checkExpire');

module.exports = token => {
  return new Promise((resolve, reject) => {
    checkExpire(token, (error, result) => {
      if (error) {
        console.log('error from checkExpire ', error);
        reject(error);
      } else {
        console.log('checkExpire: ', result.rows[0].exists);
        resolve(result.rows[0].exists);
      }
    });
  });
};
