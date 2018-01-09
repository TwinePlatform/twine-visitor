const dbConnection = require("../dbConnection");

const getActivitiesQuery = "SELECT name FROM activities";

const activities = () =>
  new Promise((resolve, reject) => {
    dbConnection
      .query(getActivitiesQuery)
      .then(result => {
        if (result.rowCount === 0) {
          return reject("No activities found");
        }
        resolve(result.rows);
      })
      .catch(error => {
        return reject(error);
      });
  });

module.exports = activities;
