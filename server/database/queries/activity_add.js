const insertInfo = `
INSERT INTO activities (name, cb_id) VALUES ($1, $2)
RETURNING *`;

const insertActivity = (dbConnection, name, cbId) => {
  if (!name || !cbId) return Promise.reject(new Error('Bad query arguments'));

  return dbConnection.query(insertInfo, [name, cbId]).then((res) => res.rows[0]);
};

module.exports = insertActivity;
