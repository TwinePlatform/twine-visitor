const dbConnection = require('../dbConnection');

const insertVisit = 'INSERT INTO visits (usersId, activitiesId, date) VALUES ((SELECT id FROM users WHERE hash = $1),(SELECT id FROM activities WHERE name = $2), DEFAULT)';

const putVisitsData = (hashString, activitiesName, cb) => {
  dbConnection.query(insertVisit, [hashString, activitiesName], (err, res) => {
    if (err) { return cb(err); }

    cb(null, res);
  });
};

module.exports = putVisitsData;
