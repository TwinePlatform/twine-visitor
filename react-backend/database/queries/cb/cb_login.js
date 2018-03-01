const checkCBlogindetails = `
  SELECT EXISTS(
    SELECT 1 FROM cbusiness
    WHERE email = $1 AND hash_pwd = $2
  )`;

const cbLogin = (dbConnection, email, hashedPwd) => {
  if (!email || !hashedPwd)
    return Promise.reject(new Error('Incorrect query arguments'));

  return dbConnection
    .query(checkCBlogindetails, [email, hashedPwd])
    .then(res => res.rows[0].exists)
};

module.exports = cbLogin;
