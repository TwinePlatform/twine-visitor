const dbConnection = require('../dbConnection');

const checkFullname = 'SELECT EXISTS(SELECT 1 FROM users WHERE fullname = $1)';

const getUserAlreadyExists = (fullname, cb) => {
  dbConnection.query(checkFullname, [fullname], (err, res) => {
    if (err) { return cb(err); }
    cb(null, res);
  });
};

module.exports = getUserAlreadyExists;
