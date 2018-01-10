const dbConnection = require("../../dbConnection");

const insertToken =
  "UPDATE cbusiness SET token = $1, tokenExpire = $2 WHERE email = $3";

const putTokenData = (token, tokenExpire, formEmail) => {
  return new Promise((resolve, reject) => {
    dbConnection
      .query(insertToken, [token, tokenExpire, formEmail])
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        return reject("There was an error with the putTokenData query");
      });
  });
};

module.exports = putTokenData;
