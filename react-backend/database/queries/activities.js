const dbConnection = require('../dbConnection');

const getActivitiesQuery =
  'SELECT id, name, monday, tuesday, wednesday, thursday, friday, saturday, sunday FROM activities WHERE cb_id=$1 AND deleted=false';

const activities = cbId => {
  if (!cbId)
    return Promise.reject(new Error('No Community Business ID supplied'));

  return dbConnection.query(getActivitiesQuery, [cbId]).then(res => res.rows);
};

module.exports = activities;
