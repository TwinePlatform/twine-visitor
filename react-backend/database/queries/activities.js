const dbConnection = require('../dbConnection');

const getActivitiesQuery = 'SELECT name FROM activities';

const activities = () =>
  new Promise((resolve, reject) => {
    dbConnection.query(getActivitiesQuery)
      .then((result) => {
        if (res.rowCount === 0) {
          return reject('No activities found');
        }
        resolve(res.rows);
      })
      .catch((error) => {
        return reject(err);
      });
  });

module.exports = activities;
