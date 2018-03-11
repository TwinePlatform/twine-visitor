const cbAdmin = {
  then: new Date('2000-01-01T00:00:00.000Z'),
  now: new Date(Date.now()),

  getFeedback: async (
    dbConnection,
    { cbId, since = cbAdmin.then, until = cbAdmin.now }
  ) => {
    const getUserDetailsQuery = `SELECT feedback_score, feedback_date FROM feedback WHERE cb_id = $1 AND feedback_date BETWEEN $2 AND $3`;
    const query = await dbConnection.query(getUserDetailsQuery, [
      cbId,
      since,
      until,
    ]);
    return query.rows;
  },
};

module.exports = cbAdmin;
