const dbConnection = require('../../dbConnection');

const getCBQuery = 'SELECT id, org_name FROM cbusiness WHERE email=$1';

const getCBFromEmail = (email, cb) => {
  console.log('i am in getCBFromEmail');
  dbConnection.query(getCBQuery, [email], (err, res) => {
    if (err) {
      return cb(err);
    }
    cb(null, res.rows);
  });
};

module.exports = getCBFromEmail;
