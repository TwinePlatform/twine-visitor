const dbConnection = require('../dbConnection');

const insertVisit = `
   INSERT INTO visits (usersId, activitiesId, cb_id, date)
   VALUES (
     (SELECT id FROM users WHERE hash = $1),
     (SELECT id FROM activities WHERE name = $2 LIMIT 1),
     $3,
     DEFAULT)`;

const putVisitsData = (hashString, activitiesName, cb_id) =>
  dbConnection.query(insertVisit, [hashString, activitiesName, cb_id]);

module.exports = putVisitsData;
