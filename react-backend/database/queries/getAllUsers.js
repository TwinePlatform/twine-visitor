const dbConnection = require('../dbConnection');

const getAllUsersQuery =
  'Select users.id, users.sex, users.yearofbirth, activities.name, visits.date from users inner join visits on users.id=visits.usersid inner join activities on visits.activitiesid = activities.id where activities.cb_id = $1';

const getAllUsers = cbId =>
  new Promise((resolve, reject) => {
    dbConnection
      .query(getAllUsersQuery, [cbId])
      .then(res => {
        if (res.rowCount === 0) {
          return reject('No user found');
        }
        resolve(res.rows);
      })
      .catch(reject);
  });

module.exports = getAllUsers;
