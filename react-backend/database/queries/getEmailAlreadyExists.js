const dbConnection = require('../dbConnection');

const checkEmail = 'SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)';

const getEmailAlreadyExists = (email, cb) => {
  dbConnection.query(checkEmail, [email], (err, res) => {
    if (err) { return cb(err); }
    cb(null, res);
  });
};

module.exports = getEmailAlreadyExists;
