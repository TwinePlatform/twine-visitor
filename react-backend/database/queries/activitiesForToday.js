const dbConnection = require('../dbConnection');

const getActivitiesForMonday =
  'SELECT id, name FROM activities WHERE monday=true AND deleted=false AND cb_id=$1';
const getActivitiesForTuesday =
  'SELECT id, name FROM activities WHERE tuesday=true AND deleted=false AND cb_id=$1';
const getActivitiesForWednesday =
  'SELECT id, name FROM activities WHERE wednesday=true AND deleted=false AND cb_id=$1';
const getActivitiesForThursday =
  'SELECT id, name FROM activities WHERE thursday=true AND deleted=false AND cb_id=$1';
const getActivitiesForFriday =
  'SELECT id, name FROM activities WHERE friday=true AND deleted=false AND cb_id=$1';
const getActivitiesForSaturday =
  'SELECT id, name FROM activities WHERE saturday=true AND deleted=false AND cb_id=$1';
const getActivitiesForSunday =
  'SELECT id, name FROM activities WHERE sunday=true AND deleted=false AND cb_id=$1';

const activitiesForToday = (cb_id, day) =>
  new Promise((resolve, reject) => {
    switch (day) {
      case 'monday':
        dbConnection.query(getActivitiesForMonday, [cb_id], (err, res) => {
          if (err) {
            return reject(err);
          }
          resolve(res.rows);
        });
      case 'tuesday':
        dbConnection.query(getActivitiesForTuesday, [cb_id], (err, res) => {
          if (err) {
            return reject(err);
          }
          resolve(res.rows);
        });
      case 'wednesday':
        dbConnection.query(getActivitiesForWednesday, [cb_id], (err, res) => {
          if (err) {
            return reject(err);
          }
          resolve(res.rows);
        });
      case 'thursday':
        dbConnection.query(getActivitiesForThursday, [cb_id], (err, res) => {
          if (err) {
            return reject(err);
          }
          resolve(res.rows);
        });
      case 'friday':
        dbConnection.query(getActivitiesForFriday, [cb_id], (err, res) => {
          if (err) {
            return reject(err);
          }
          resolve(res.rows);
        });
      case 'saturday':
        dbConnection.query(getActivitiesForSaturday, [cb_id], (err, res) => {
          if (err) {
            return reject(err);
          }
          resolve(res.rows);
        });
      case 'sunday':
        dbConnection.query(getActivitiesForSunday, [cb_id], (err, res) => {
          if (err) {
            return reject(err);
          }
          resolve(res.rows);
        });
    }
  });

module.exports = activitiesForToday;
