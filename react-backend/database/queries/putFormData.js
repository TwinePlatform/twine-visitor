const dbConnection = require('../dbConnection');

const insertUser = 'INSERT INTO users (fullName, sex, yearOfBirth, email, hash) VALUES ($1, $2, $3, $4, $5)';

const putUserData = (fullname, sex, yob, email, hashString, cb) => {
  dbConnection.query(insertUser, [fullname, sex, yob, email, hashString], (err, res) => {
    if (err) { return cb(err); }

    cb(null, res);
  });
};

module.exports = putUserData;
