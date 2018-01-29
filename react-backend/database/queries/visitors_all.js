const dbConnection = require('../dbConnection');

const getAllUsersQuery = `
  SELECT users.id, users.sex, users.yearofbirth, activities.name, visits.date
  FROM users
  INNER JOIN visits ON users.id=visits.usersid
  INNER JOIN activities ON visits.activitiesid = activities.id
  WHERE activities.cb_id = $1`;

const getAllUsers = cbId =>
  new Promise((resolve, reject) => {
    dbConnection
      .query(getAllUsersQuery, [cbId])
      .then(res => {
        if (!res.rowCount) {
          return reject('No user found');
        }
        resolve(res.rows);
      })
      .catch(reject);
  });

module.exports = getAllUsers;
