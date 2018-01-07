const dbConnection = require('../dbConnection');

const getActivitiesQuery = 'SELECT id, name FROM activities WHERE deleted=false';

const activities = () =>
  new Promise((resolve, reject) => {
    dbConnection.query(getActivitiesQuery, (err, res) => {
      if (err) {
        return reject(err);
      }
      if (res.rowCount === 0) {
        return reject('No activities found');
      }
      resolve(res.rows);
    });
  });

module.exports = activities;
