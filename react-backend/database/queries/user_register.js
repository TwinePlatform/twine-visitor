const insertUser = `
  INSERT INTO users (cb_id, fullName, sex, phone, yearOfBirth, email, hash)
  VALUES ($1, $2, $3, $4, $5, $6, $7)`;

const putUserData = (
  dbConnection,
  cb_id,
  fullname,
  sex,
  phone,
  yob,
  email,
  hashString
) =>
  dbConnection.query(insertUser, [
    cb_id,
    fullname,
    sex,
    phone,
    yob,
    email,
    hashString,
  ]);

module.exports = putUserData;
