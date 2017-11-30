const dbConnection = require('../dbConnection');

const getAllUsersQuery =
  'Select users.id, users.sex, users.yearofbirth, activities.name, visits.date from users inner join visits on users.id=visits.usersid inner join activities on visits.activitiesid = activities.id';

const getAllUsers = () =>
  new Promise((resolve, reject) => {
    dbConnection.query(getAllUsersQuery, (err, res) => {
      if (err) {
        return reject(err);
      }
      if (res.rowCount === 0) {
        return reject('No user found');
      }
      resolve(res.rows);
    });
  });

module.exports = getAllUsers;
