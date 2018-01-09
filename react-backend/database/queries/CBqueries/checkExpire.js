const dbConnection = require("../../dbConnection");

const checkTokenquery =
  "SELECT EXISTS(SELECT 1 FROM cbusiness WHERE token = $1 AND tokenexpire >= $2)";

const checkToken = token => {
  const expire = Date.now();
  return new Promise((resolve, reject) => {
    dbConnection
      .query(checkTokenquery, [token, expire])
      .then(result => {
        resolve(result.rows[0].exists);
      })
      .catch(error => {
        reject("There was an error with the checkExpire query");
      });
  });
};
module.exports = checkToken;
