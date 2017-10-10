const dbConnection = require('../dbConnection');

const getAllUsers = 'SELECT fullname, sex, yearofbirth, email FROM users';


const getHash = () => {
  return new Promise((resolve, reject)=>{
    dbConnection.query(getAllUsers, (err, res) => {
      if (err) { return reject(err); }
      if (res.rowCount === 0) {return reject("No user found")}
      resolve(res.rows)
    });
  })
};

module.exports = getHash;
