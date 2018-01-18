const dbConnection = require('../dbConnection');

const getCBDetailsQuery = `
  SELECT *
  FROM cbusiness
  WHERE cb_id = $1`;

const getCBDetails = cbId =>
  new Promise((resolve, reject) => {
    dbConnection
      .query(getCBDetailsQuery, [cbId])
      .then(res => {
        // if (res.rowCount === 0) {
        //   return reject('No user found');
        // }
        return resolve(res.rows);
      })
      .catch(reject);
  });

module.exports = getCBDetails;
