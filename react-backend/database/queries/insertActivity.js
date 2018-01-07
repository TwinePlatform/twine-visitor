const dbConnection = require('../dbConnection');

const insertInfo = 'INSERT INTO activities (id, name) VALUES ($1, $2)';

const insertActivity = (id, name, cb) => {
  dbConnection.query(insertInfo, [id, name], (err, res) => {
    if (err) {
      return cb(err);
    }

    cb(null, res);
  });
};

module.exports = insertActivity;
