const dbConnection = require('../dbConnection');

const checkFullname = 'SELECT EXISTS(SELECT 1 FROM cbusiness WHERE email = $1)';

const getCBAlreadyExists = (email) => {
  new Promise((resolve, reject) => {
    dbConnection.query(checkFullname, [email], (err, res) => {
      if (err) {
        return reject('There was an error with the getCBAlreadyExists query');
      }
      resolve(res);
    });
  })
};

module.exports = getCBAlreadyExists;
