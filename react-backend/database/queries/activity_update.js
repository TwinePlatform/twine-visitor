const dbConnection = require('../dbConnection');

const updateActivityQuery = `
UPDATE activities SET monday = $2, tuesday = $3, wednesday=$4,
thursday=$5, friday=$6, saturday=$7, sunday=$8
WHERE id = $1 AND cb_id = $9`;

const updateActivity = (
  id,
  monday,
  tuesday,
  wednesday,
  thursday,
  friday,
  saturday,
  sunday,
  cbId
) => {
  if (!id || !cbId) return Promise.reject(new Error('Bad query arguments'));
  return dbConnection.query(updateActivityQuery, [
    id,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,
    cbId
  ]);
};

module.exports = updateActivity;
