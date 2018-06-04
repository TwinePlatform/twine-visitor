const checkActivityQuery =
  'SELECT EXISTS(SELECT 1 FROM activities WHERE name = $1 AND cb_id = $2 AND deleted = False)';

const activityCheckExists = (dbConnection, activity, cbId) =>
  dbConnection
    .query(checkActivityQuery, [activity, cbId])
    .then((res) => res.rows[0].exists);

module.exports = activityCheckExists;
