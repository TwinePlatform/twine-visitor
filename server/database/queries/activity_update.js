const { updateQuery } = require('../../shared/models/query_builder');

const updateActivity = async (dbConnection, columns, options) => {
  if (!options) throw new Error('Bad query arguments');

  const activity = await dbConnection.query(
    updateQuery('activities', columns, options)
  );
  return activity.rows[0] || null;
};

module.exports = updateActivity;
