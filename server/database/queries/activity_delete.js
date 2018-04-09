const deleteId =
  'UPDATE activities SET deleted = true WHERE id = $1 AND cb_id = $2';

const deleteActivity = (dbConnection, id, cbId) => {
  if (!id || !cbId)
    return Promise.reject(new Error('Incorrect query arguments'));

  return dbConnection.query(deleteId, [id, cbId]);
};

module.exports = deleteActivity;
