const dbConnection = require("../dbConnection");

const checkCBlogindetails =
  "SELECT EXISTS(SELECT 1 FROM cbusiness WHERE email = $1 AND hash_pwd = $2)";

const getCBlogindetailsvalid = (email, hash_pwd) => {
  new Promise((resolve, reject) => {
    dbConnection.query(checkCBlogindetails, [email, hash_pwd], (err, res) => {
      if (err) {
        return reject('There was an error with the getCBlogindetailsvalid query');
      }
      resolve(res);
    });
  })
};

module.exports = getCBlogindetailsvalid;
