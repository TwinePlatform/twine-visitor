const insertToken =
  'UPDATE cbusiness SET token = $1, tokenExpire = $2 WHERE email = $3';

const putTokenData = (dbConnection, token, tokenExpire, formEmail) =>
  dbConnection.query(insertToken, [token, tokenExpire, formEmail]);

module.exports = putTokenData;
