const dbConnection = require('../dbConnection');

const getActivitiesQuery =
  'SELECT id, name, monday, tuesday, wednesday, thursday, friday, saturday, sunday FROM activities WHERE cb_id=$1 AND deleted=false';

const activities = cbId =>
  new Promise((resolve, reject) => {
    if (!cbId) return reject(new Error('No Community Business ID supplied'));

    dbConnection
      .query(getActivitiesQuery, [cbId])
      .then(res => resolve(res.rows))
      .catch(reject);
  });

module.exports = activities;
