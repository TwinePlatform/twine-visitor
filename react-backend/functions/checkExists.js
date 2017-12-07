const checkToken = require('../database/queries/CBqueries/checkToken');

module.exports = token => {
  checkToken(token, (error, result) => {
    if (error) {
      console.log('error from checkToken ', error);
      throw error;
    } else {
      // console.log(typeof tokenExists, tokenExists);
      console.log(result.rows[0].exists);
      return result.rows[0].exists;
    }
  });
};
