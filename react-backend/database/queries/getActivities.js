const dbConnection = require('../dbConnection');

const checkActivities = 'SELECT name FROM activities';

const getActivities = cb => {
  dbConnection.query(checkActivities, (err, res) => {
    if (err) {
      return cb(err);
    }

    cb(null, res);
  });
};

module.exports = getActivities;
