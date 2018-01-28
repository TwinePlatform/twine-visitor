const dbConnection = require('../../dbConnection');

const checkCBlogindetails = `
  SELECT EXISTS(
    SELECT 1 FROM cbusiness
    WHERE email = $1 AND hash_pwd = $2
  )`;

const cbLogin = (email, hashedPwd) =>
  new Promise((resolve, reject) => {
    if (!email || !hashedPwd)
      return reject(new Error('Incorrect query arguments'));

    dbConnection
      .query(checkCBlogindetails, [email, hashedPwd])
      .then(res => resolve(res.rows[0].exists))
      .catch(reject);
  });

module.exports = cbLogin;
