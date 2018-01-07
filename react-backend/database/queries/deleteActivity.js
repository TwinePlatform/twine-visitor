const dbConnection = require('../dbConnection');

const deleteId = 'UPDATE activities SET deleted = true WHERE id = $1 AND cb_id = $2';

const deleteActivity = (id, cb_id, cb) => {
  dbConnection.query(deleteId, [id, cb_id], (err, res) => {
    if (err) {
      return cb(err);
    }

    cb(null, res);
  });
};

module.exports = deleteActivity;
