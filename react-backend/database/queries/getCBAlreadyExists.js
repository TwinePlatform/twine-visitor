const dbConnection = require('../dbConnection');

const checkFullname = 'SELECT EXISTS(SELECT 1 FROM cbusiness WHERE email = $1)';

const getCBAlreadyExists = (email, cb) => {
  dbConnection.query(checkFullname, [email], (err, res) => {
    if (err) {
      return cb(err);
    }
    cb(null, res);
  });
};

module.exports = getCBAlreadyExists;
