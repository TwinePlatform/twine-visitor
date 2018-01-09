const dbConnection = require('../dbConnection');

const insertInfo = 'INSERT INTO activities (name, cb_id) VALUES ($1, $2)';

const insertActivity = (name, cb_id) =>
  new Promise((resolve, reject) => {
    dbConnection
      .query(insertInfo, [name, cb_id])
      .then(res => resolve(res))
      .catch((err) => {
        reject(err);
      });
  });

module.exports = insertActivity;
