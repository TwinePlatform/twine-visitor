const dbConnection = require('../dbConnection');

const checkFullname = 'SELECT EXISTS(SELECT 1 FROM users WHERE fullname=$1) (VALUES ($1))';
const checkEmail = 'SELECT EXISTS(SELECT 1 FROM users WHERE email=$2) (VALUES ($2))';
let res = false;

const getUserAlreadyExists = (fullname, email, cb) => {
  dbConnection.query(checkFullname, fullname, (err1, res1) => {
    if (err1) { return cb(err1); }

    dbConnection.query(checkEmail, email, (err2, res2) => {
      if (err2) { return cb(err2); }

      if (res1 && res2 === 'TRUE') {
        res = true;
      } else {
        res = false;
      }
      cb(null, res);
    });
  });
};

module.exports = getUserAlreadyExists;
