const dbConnection = require('../dbConnection');

const insertUser =
  'INSERT INTO users (fullName, sex, yearOfBirth, email, hash) VALUES ($1, $2, $3, $4, $5)';

const putUserData = (fullname, sex, yob, email, hashString) => {
  new Promise((resolve, reject) => {
    dbConnection.query(insertUser, [fullname, sex, yob, email, hashString], (err, res) => {
      if (err) {
        return reject('There was an error with the putUserData query');
      }

      resolve(res);
    });
  })
};

module.exports = putUserData;
