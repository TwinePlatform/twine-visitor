const dbConnection = require('../../dbConnection');

const insertCB = 'INSERT INTO cbusiness (org_name, email, genre, hash_pwd) VALUES ($1, $2, $3, $4)';

const putCBData = (org_name, email, genre, hash_pwd, cb) => {
  dbConnection.query(insertCB, [org_name, email, genre, hash_pwd], (err, res) => {
    if (err) {
      return cb(err);
    }

    cb(null, res);
  });
};

module.exports = putCBData;
