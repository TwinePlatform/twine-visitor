const then = new Date('2000-01-01T00:00:00.000Z');
const now = new Date(Date.now());

module.exports = {
  getFeedback: async (dbConnection, { cbId, since = then, until = now }) => {
    const getFeedbackQuery = `SELECT feedback_score, feedback_date FROM feedback WHERE cb_id = $1 AND feedback_date BETWEEN $2 AND $3`;
    const query = await dbConnection.query(getFeedbackQuery, [
      cbId,
      since,
      until,
    ]);
    return query.rows;
  },

  postFeedback: async (dbConnection, { cbEmail, feedbackScore }) => {
    const postFeedbackQuery = `
    INSERT INTO feedback 
    (cb_id, feedback_score) 
    VALUES (
      (SELECT cbusiness.id FROM cbusiness 
        WHERE cbusiness.email = $1 LIMIT 1)
    , $2) 
    RETURNING *`;

    const query = await dbConnection.query(postFeedbackQuery, [
      cbEmail,
      feedbackScore,
    ]);

    return query.rows;
  },
};
