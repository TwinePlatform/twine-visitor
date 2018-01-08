const dbConnection = require('../../dbConnection');

const insertToken =
  'UPDATE cbusiness SET token = $1, tokenExpire = $2 WHERE email = $3';

const putTokenData = (token, tokenExpire, formEmail) => {
  new Promise((resolve, reject) => {
    dbConnection.query(insertToken, [token, tokenExpire, formEmail], (err, res) => {
      if (err) {
        return reject('There was an error with the putTokenData query');
      }
      resolve(res);
    }
    );
  })
};

module.exports = putTokenData;
