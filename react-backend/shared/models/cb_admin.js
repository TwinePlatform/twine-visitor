const then = new Date('2000-01-01T00:00:00.000Z');

module.exports = {
  getFeedback: async (
    dbConnection,
    { cbId, since = then, until = new Date(Date.now()) }
  ) => {
    const getFeedbackQuery = `SELECT COUNT (*), feedback_score  FROM feedback WHERE cb_id = $1 AND feedback_date BETWEEN $2 AND $3 GROUP BY feedback_score`;
    const query = await dbConnection.query(getFeedbackQuery, [
      cbId,
      since,
      until,
    ]);
    return query.rows;
  },

  insertFeedback: async (dbConnection, { cbId, feedbackScore }) => {
    const insertFeedbackQuery = `
    INSERT INTO feedback 
    (cb_id, feedback_score) 
    VALUES ( $1, $2) 
    RETURNING *`;

    const query = await dbConnection.query(insertFeedbackQuery, [
      cbId,
      feedbackScore,
    ]);

    return query.rows[0];
  },
};
