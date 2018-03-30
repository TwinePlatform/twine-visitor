const getCBDetailsQuery = `
  SELECT id, org_name, genre, email, uploadedFileCloudinaryUrl, date
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
