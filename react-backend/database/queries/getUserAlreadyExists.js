const dbConnection = require('../dbConnection');

const checkFullname = 'SELECT EXISTS(SELECT 1 FROM users WHERE fullname = $1 AND email = $2)';

const getUserAlreadyExists = (fullname, email, cb) => {
  dbConnection.query(checkFullname, [fullname, email], (err, res) => {
    if (err) {
      return cb(err);
    }
    cb(null, res);
  });
};

module.exports = getUserAlreadyExists;
