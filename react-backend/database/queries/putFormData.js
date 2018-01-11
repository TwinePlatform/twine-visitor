const dbConnection = require('../dbConnection');

const insertUser = `
  INSERT INTO users (fullName, sex, yearOfBirth, email, hash)
  VALUES ($1, $2, $3, $4, $5)`;

const putUserData = (fullname, sex, yob, email, hashString) =>
  dbConnection.query(insertUser, [fullname, sex, yob, email, hashString]);

module.exports = putUserData;
