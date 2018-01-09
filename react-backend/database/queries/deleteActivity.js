const dbConnection = require('../dbConnection');

const deleteId = 'UPDATE activities SET deleted = true WHERE id = $1 AND cb_id = $2';

const deleteActivity = (id, cb_id) =>
  new Promise((resolve, reject) => {
    dbConnection
      .query(deleteId, [id, cb_id])
      .then(res => resolve(null, res))
      .catch((err) => {
        reject(err);
      });
  });

module.exports = deleteActivity;
