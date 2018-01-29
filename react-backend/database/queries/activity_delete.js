const dbConnection = require('../dbConnection');

const deleteId =
  'UPDATE activities SET deleted = true WHERE id = $1 AND cb_id = $2';

const deleteActivity = (id, cbId) =>
  new Promise((resolve, reject) => {
    if (!id || !cbId) return reject(new Error('Incorrect query arguments'));

    dbConnection
      .query(deleteId, [id, cbId])
      .then(resolve)
      .catch(reject);
  });

module.exports = deleteActivity;
