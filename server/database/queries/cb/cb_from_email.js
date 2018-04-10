const getCBQuery =
  'SELECT id, org_name, uploadedFileCloudinaryUrl FROM cbusiness WHERE email=$1';

const getCBFromEmail = (dbConnection, email) =>
  dbConnection.query(getCBQuery, [email])
    .then((res) => res.rows[0] || null);

module.exports = getCBFromEmail;
