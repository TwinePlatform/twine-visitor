const dbConnection = require('../dbConnection');

const insertVisit = `
   INSERT INTO visits (usersId, activitiesId, date)
   VALUES (
     (SELECT id FROM users WHERE hash = $1),
     (SELECT id FROM activities WHERE name = $2 LIMIT 1),
     DEFAULT)`;

const putVisitsData = (hashString, activitiesName) =>
  dbConnection.query(insertVisit, [hashString, activitiesName]);

module.exports = putVisitsData;
