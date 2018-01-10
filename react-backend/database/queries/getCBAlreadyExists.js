const dbConnection = require('../dbConnection');

const checkFullname = 'SELECT EXISTS(SELECT 1 FROM cbusiness WHERE email = $1)';

const getCBAlreadyExists = email => {
  return new Promise((resolve, reject) => {
    dbConnection
      .query(checkFullname, [email])
      .then(result => {
        resolve(result.rows[0].exists);
      })
      .catch(error => {
        return reject('There was an error with the getCBAlreadyExists query');
      });
  });
};

module.exports = getCBAlreadyExists;
