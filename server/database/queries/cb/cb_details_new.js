const { filter } = require('ramda');
const { updateQuery } = require('../../../shared/models/query_builder');
const getCbDetails = require('./cb_details');

const putNewCBDetails = async (
  dbConnection,
  id,
  orgName,
  genre,
  email,
  uploadedFileCloudinaryUrl
) => {
  const values = filter(Boolean, {
    org_name: orgName,
    genre,
    email,
    uploadedFileCloudinaryUrl,
  });

  if (Object.keys(values).length === 0) {
    return getCbDetails(dbConnection, id);
  }

  const query = updateQuery('cbusiness', values, {
    where: { id },
    returning: 'id, org_name, genre, email, uploadedFileCloudinaryUrl, date',
  });

  const res = await dbConnection.query(query);

  if (!res.rowCount) {
    throw new Error('No corresponding user found');
  }

  return res.rows[0];
};
module.exports = putNewCBDetails;
