const dbConnection = require('../dbConnection');

const deleteId = 'UPDATE activities SET deleted = true WHERE id = $1';

const deleteActivity = (id, cb) => {
  dbConnection.query(deleteId, [id], (err, res) => {
    if (err) {
      return cb(err);
    }

    cb(null, res);
  });
};

module.exports = deleteActivity;
