const connect = require('./dbConnection.js');

const clean = () =>
  new Promise((resolve, reject) =>
    connect
      .query('TRUNCATE TABLE users, visits, activities, cbusiness;')
      .then(() => {
        resolve();
      })
      .catch(reject)
  );

module.exports = clean;
