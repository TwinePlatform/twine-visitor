module.exports = {
  getAllCbsNames: async dbConnection => {
    const getFeedbackQuery = 'SELECT org_name FROM cbusiness';
    const query = await dbConnection.query(getFeedbackQuery);
    return query.rows;
  },
};
