const dbConnection = require("../dbConnection");

const checkName = "SELECT fullName, hash FROM users WHERE hash = $1";

const getHash = hashString =>
  new Promise((resolve, reject) => {
    dbConnection
      .query(checkName, [hashString])
      .then(result => {
        if (result.rowCount === 0) {
          return reject("No user found");
        }
        resolve(result.rows[0]);
      })
      .catch(error => {
        reject("There was an error with the getHash query");
      });
  });

module.exports = getHash;
