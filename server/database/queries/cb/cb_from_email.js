const getCBQuery =
  'SELECT id, org_name, uploadedFileCloudinaryUrl FROM cbusiness WHERE email=$1';

const getCBFromEmail = (dbConnection, email) =>
  new Promise((resolve, reject) => {
    dbConnection
      .query(getCBQuery, [email])
      .then(res => {
        if (res.rowCount) {
          return resolve(res.rows[0]);
        }
        reject('no results found');
      })
      .catch(reject);
  });

module.exports = getCBFromEmail;
