const dbConnection = require('../dbConnection');

const insertInfo = 'INSERT INTO activities (id, name, cb_id) VALUES ($1, $2, $3)';

const insertActivity = (id, name, cb_id, cb) => {
  dbConnection.query(insertInfo, [id, name, cb_id], (err, res) => {
    if (err) {
      return cb(err);
    }

    cb(null, res);
  });
};

module.exports = insertActivity;
