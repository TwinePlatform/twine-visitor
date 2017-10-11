const dbConnection = require('../dbConnection');

const checkName = 'SELECT fullName, hash FROM users WHERE hash = $1';


const getHash = (hashString) => {
  return new Promise((resolve, reject)=>{
    dbConnection.query(checkName, [hashString], (err, res) => {
      if (err) { return reject(err); }
      if (res.rowCount === 0) {return reject("No user found")}
      resolve(res.rows[0].fullname)
    });
  })
};

module.exports = getHash;
