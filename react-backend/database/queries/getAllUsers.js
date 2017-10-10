const dbConnection = require('../dbConnection');

const getAllUsersQuery = 'SELECT fullname, sex, yearofbirth, email FROM users';


const getAllUsers = () => {
  return new Promise((resolve, reject)=>{
    dbConnection.query(getAllUsersQuery, (err, res) => {
      if (err) { return reject(err); }
      if (res.rowCount === 0) {return reject("No user found")}
      resolve(res.rows)
    });
  })
};

module.exports = getAllUsers;
