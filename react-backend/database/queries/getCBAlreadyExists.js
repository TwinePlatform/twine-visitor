const dbConnection = require('../dbConnection');

const checkFullname = 'SELECT EXISTS(SELECT 1 FROM cbusiness WHERE org_name = $1 AND email = $2)';

const getCBAlreadyExists = (org_name, email, cb) => {
  dbConnection.query(checkFullname, [org_name, email], (err, res) => {
    if (err) {
      return cb(err);
    }
    cb(null, res);
  });
};

module.exports = getCBAlreadyExists;
