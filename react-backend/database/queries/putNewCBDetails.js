const dbConnection = require('../dbConnection');

const putNewCBDetailsQuery =
  'UPDATE cbusiness SET org_name = $2, genre = $3, email = $4 WHERE id = $1 RETURNING *';

const putNewCBDetails = (id, org_name, genre, email) =>
  new Promise((resolve, reject) => {
    dbConnection
      .query(putNewCBDetailsQuery, [id, org_name, genre, email])
      .then(res => {
        if (!res.rowCount) return reject('No user found');
        return resolve(res.rows[0]);
      })
      .catch(reject);
  });

module.exports = putNewCBDetails;
