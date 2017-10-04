const dbConnection = require('../dbConnection');

const insertVisit = "INSERT INTO visits (usersId, activitiesId, date) VALUES('SELECT id FROM users WHERE hash = 9b57815dcc7568e942baed14c61f636034f138e5f43d72f26ec32a', 'SELECT id FROM activities WHERE name = Yoga', DEFAULT)";


const putVisitsData = (hashString, activitiesName, timestamp, cb) => {
  dbConnection.query(insertVisit, hashString, activitiesName, timestamp, (err, res) => {
    if (err) { return cb(err); }

    cb(null, res);
  });
};

module.exports = putVisitsData;
