module.exports = {
  getCbFeedback: async (dbConnection, cbId) => {
    const getUserDetailsQuery = `SELECT user_feedback, feedback_date FROM feedback WHERE cb_id = $1`;
    const query = await dbConnection.query(getUserDetailsQuery, [cbId]);
    return query.rows;
  },
};
