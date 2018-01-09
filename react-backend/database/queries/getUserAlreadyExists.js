const dbConnection = require('../dbConnection');

const checkFullname = 'SELECT EXISTS(SELECT 1 FROM users WHERE fullname = $1 AND email = $2)';

const getUserAlreadyExists = (fullname, email) => {
  new Promise((resolve, reject) => {
    dbConnection.query(checkFullname, [fullname, email])
      .then((result) => {
        resolve(res.rows[0].exists);
      })
      .catch((error) => {
        return reject('There was an error with the getUserAlreadyExists query');
      });
  })
};

module.exports = getUserAlreadyExists;
