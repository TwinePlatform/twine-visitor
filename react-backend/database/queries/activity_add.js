const dbConnection = require('../dbConnection');

const insertInfo = `
INSERT INTO activities (name, cb_id) VALUES ($1, $2)
RETURNING id`;

const insertActivity = (name, cbId) => {
  if (!name || !cbId) return Promise.reject(new Error('Bad query arguments'));

  dbConnection.query(insertInfo, [name, cbId]).then(res => res.rows[0].id);
};

module.exports = insertActivity;
