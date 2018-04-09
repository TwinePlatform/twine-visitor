const { updateQuery } = require('../../shared/models/query_builder');

const updateActivity = async (dbConnection, id, cbId, columns) => {
  if (!id || !cbId)
    throw new Error('Bad query arguments');

  const activity = await dbConnection.query(updateQuery('activities', columns, { id, cb_id: cbId }, '*'));
  return activity.rows[0] || null;
};

module.exports = updateActivity;
