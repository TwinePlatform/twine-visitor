const dbConnection = require('../../dbConnection');

const insertCB =
  'INSERT INTO cbusiness (org_name, email, genre, hash_pwd) VALUES ($1, $2, $3, $4)';

const putCBData = (org_name, email, genre, hash_pwd) => {
  return new Promise((resolve, reject) => {
    dbConnection
      .query(insertCB, [org_name, email, genre, hash_pwd])
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        reject('There was an error with the putCBData query');
      });
  });
};
module.exports = putCBData;
