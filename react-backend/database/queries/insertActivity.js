const dbConnection = require('../dbConnection');

const insertInfo = `
INSERT INTO activities (name, cb_id) VALUES ($1, $2)
RETURNING id`;

const insertActivity = (name, cbId) =>
  new Promise((resolve, reject) => {
    if (!name || !cbId) return reject(new Error('Bad query arguments'));

    dbConnection
      .query(insertInfo, [name, cbId])
      .then(res => resolve(res.rows[0]))
      .catch(reject);
  });

module.exports = insertActivity;
