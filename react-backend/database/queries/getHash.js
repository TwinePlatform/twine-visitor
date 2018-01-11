const dbConnection = require('../dbConnection');

const checkName = 'SELECT fullName, hash FROM users WHERE hash = $1';

const getHash = hashString =>
  new Promise((resolve, reject) => {
    dbConnection
      .query(checkName, [hashString])
      .then(res => {
        if (!res.rowCount) return reject(new Error('No user found'));

        resolve(res.rows[0]);
      })
      .catch(reject);
  });

module.exports = getHash;
