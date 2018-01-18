const dbConnection = require('../dbConnection');

const putNewCBDetailsQuery =
  'UPDATE cbusiness SET org_name = $3 genre = $5, email = $6 WHERE id = $1 RETURNING *';

const putNewCBDetails = (cbId, org_name, genre, email) =>
  new Promise((resolve, reject) => {
    dbConnection
      .query(putNewCBDetailsQuery, [cbId, org_name, genre, email])
      .then(res => {
        if (!res.rowCount) return reject('No user found');

        return resolve(res.rows[0]);
      })
      .catch(reject);
  });

module.exports = putNewCBDetails;
