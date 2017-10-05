const dbConnection = require('../dbConnection');

const checkName = 'SELECT fullName FROM users WHERE hash = $1';


const getHash = (hashString, cb) => {
  dbConnection.query(checkName, [hashString], (err, res) => {
    if (err) { return cb(err); }

    cb(null, res);
  });
};

module.exports = getHash;
