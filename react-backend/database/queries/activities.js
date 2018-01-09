const dbConnection = require('../dbConnection');

const getActivitiesQuery =
  'SELECT id, name, monday, tuesday, wednesday, thursday, friday, saturday, sunday FROM activities WHERE cb_id=$1 AND deleted=false';

const activities = cb_id =>
  new Promise((resolve, reject) => {
    dbConnection.query(getActivitiesQuery, [cb_id], (err, res) => {
      if (err) {
        return reject(err);
      }
      // if (res.rowCount === 0) {
      //   return reject('No activities found');
      // }
      resolve(res.rows);
    });
  });

module.exports = activities;
