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
) =>
  new Promise((resolve, reject) => {
    if (!id || !cbId) reject(new Error('Bad query arguments'));
    dbConnection
      .query(updateActivityQuery, [
        id,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday,
        cbId,
      ])
      .then(resolve)
      .catch(reject);
  });

module.exports = updateActivity;
