const checkExpire = require('../database/queries/CBqueries/checkExpire');

module.exports = token => {
  checkExpire(token, (error, result) => {
    if (error) {
      console.log('error from checkExpire ', error);
      throw error;
    } else {
      console.log(result.rows[0].exists);
      return result.rows[0].exists;
    }
  });
};
