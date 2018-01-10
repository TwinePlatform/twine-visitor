const dbConnection = require('../dbConnection');

const checkFullname =
  'SELECT EXISTS(SELECT 1 FROM users WHERE fullname = $1 AND email = $2)';

const getUserAlreadyExists = (fullname, email) =>
  new Promise((resolve, reject) => {
    console.log(fullname, email);
    dbConnection
      .query(checkFullname, [fullname, email])
      .then(res => resolve(res.rows[0].exists))
      .catch(reject);
  });

module.exports = getUserAlreadyExists;
