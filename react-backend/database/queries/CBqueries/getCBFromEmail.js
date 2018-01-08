const dbConnection = require('../../dbConnection');

const getCBQuery = 'SELECT id, org_name FROM cbusiness WHERE email=$1';

const getCBFromEmail = (email, cb) => {
  console.log('I received this email: ', email);
  dbConnection.query(getCBQuery, [email], (err, res) => {
    if (err) {
      return cb(err);
    }
    console.log('i am res.rows', res.rows);
    cb(null, res.rows);
  });
};

module.exports = getCBFromEmail;
