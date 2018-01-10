const dbConnection = require('../dbConnection');

const insertInfo =
  'INSERT INTO activities (name, cb_id) VALUES ($1, $2) RETURNING id';

const insertActivity = (name, cbId) =>
  new Promise((resolve, reject) => {
    dbConnection
      .query(insertInfo, [name, cbId])
      .then(res => resolve(res))
      .catch((err) => {
        reject(err);
      });
  });

module.exports = insertActivity;
