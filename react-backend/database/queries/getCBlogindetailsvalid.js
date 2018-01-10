const dbConnection = require("../dbConnection");

const checkCBlogindetails =
  "SELECT EXISTS(SELECT 1 FROM cbusiness WHERE email = $1 AND hash_pwd = $2)";

const getCBlogindetailsvalid = (email, hash_pwd) => {
  return new Promise((resolve, reject) => {
    dbConnection
      .query(checkCBlogindetails, [email, hash_pwd])
      .then(result => {
        resolve(result.rows[0].exists);
      })
      .catch(error => {
        reject("There was an error with the getCBlogindetailsvalid query");
      });
  });
};

module.exports = getCBlogindetailsvalid;
