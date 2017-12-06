const dbConnection = require("../dbConnection");

const checkCBlogindetails =
  "SELECT EXISTS(SELECT 1 FROM cbusiness WHERE email = $1 AND hash_pwd = $2)";

const getCBlogindetailsvalid = (email, hash_pwd, cb) => {
  dbConnection.query(checkCBlogindetails, [email, hash_pwd], (err, res) => {
    if (err) {
      return cb(err);
    }
    cb(null, res);
  });
};

module.exports = getCBlogindetailsvalid;
