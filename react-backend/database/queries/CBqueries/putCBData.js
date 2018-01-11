const dbConnection = require('../../dbConnection');

const insertCB =
  'INSERT INTO cbusiness (org_name, email, genre, hash_pwd) VALUES ($1, $2, $3, $4)';

const putCBData = (orgName, email, genre, hashPwd) =>
  dbConnection.query(insertCB, [orgName, email, genre, hashPwd]);

module.exports = putCBData;
