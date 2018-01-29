const dbConnection = require('../dbConnection');

const putNewCBDetailsQuery = image =>
  `UPDATE cbusiness
  SET org_name = $2, genre = $3, email = $4
  ${(image && ', uploadedFileCloudinaryUrl=$5') || ''}
  WHERE id = $1
  RETURNING *`;

const putNewCBDetails = (
  id,
  org_name,
  genre,
  email,
  uploadedFileCloudinaryUrl
) =>
  new Promise((resolve, reject) => {
    const values = [id, org_name, genre, email];
    const combinedValues = uploadedFileCloudinaryUrl
      ? [...values, uploadedFileCloudinaryUrl]
      : values;

    dbConnection
      .query(putNewCBDetailsQuery(uploadedFileCloudinaryUrl), combinedValues)
      .then(res => {
        if (!res.rowCount) return reject('No user found');
        return resolve(res.rows[0]);
      })
      .catch(reject);
  });

module.exports = putNewCBDetails;
