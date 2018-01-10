const dbConnection = require("../dbConnection");

const getAllUsersQuery =
  "Select users.id, users.sex, users.yearofbirth, activities.name, visits.date from users inner join visits on users.id=visits.usersid inner join activities on visits.activitiesid = activities.id where activities.cb_id = $1";

const getAllUsers = cb_id =>
  new Promise((resolve, reject) => {
    dbConnection
      .query(getAllUsersQuery, [cb_id])
      .then(result => {
        if (result.rowCount === 0) {
          return reject("No user found");
        }
        resolve(result.rows);
      })
      .catch(error => {
        reject("There was an error with the getAllUsers query");
      });
  });

module.exports = getAllUsers;
