const dbConnection = require('../dbConnection');

const checkFullname = 'SELECT EXISTS(SELECT 1 FROM cbusiness WHERE email = $1)';

const getCBAlreadyExists = email =>
  new Promise((resolve, reject) => {
    dbConnection
      .query(checkFullname, [email])
      .then(res => {
        resolve(res.rows[0].exists);
      })
      .catch(reject);
  });

module.exports = getCBAlreadyExists;
