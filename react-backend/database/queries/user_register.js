const insertUser = `
  INSERT INTO users (cb_id, fullName, sex, yearOfBirth, email, hash)
  VALUES ($1, $2, $3, $4, $5, $6)`;

const putUserData = (dbConnection, cb_id, fullname, sex, yob, email, hashString) =>
  dbConnection.query(insertUser, [
    cb_id,
    fullname,
    sex,
    yob,
    email,
    hashString,
  ]);

module.exports = putUserData;
