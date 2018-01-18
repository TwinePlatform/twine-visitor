const dbConnection = require('../dbConnection');

const checkCB = 'SELECT EXISTS(SELECT 1 FROM cbusiness WHERE email = $1)';

const getCBAlreadyExists = email =>
  new Promise((resolve, reject) => {
    if (!email) return reject(new Error('No email supplied to query'));
    dbConnection
      .query(checkCB, [email])
      .then(res => {
        resolve(res.rows[0].exists);
      })
      .catch(reject);
  });

module.exports = getCBAlreadyExists;
