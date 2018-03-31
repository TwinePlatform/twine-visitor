const getCBDetailsQuery = `
  SELECT *
  FROM cbusiness
  WHERE id = $1`;

const getCBDetails = (dbConnection, cbId) =>
  new Promise((resolve, reject) => {
    dbConnection
      .query(getCBDetailsQuery, [cbId])
      .then(res => resolve(res.rows[0] || null))
      .catch(reject);
  });

module.exports = getCBDetails;
