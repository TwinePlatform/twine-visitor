const checkFullname =
  'SELECT EXISTS(SELECT 1 FROM users WHERE fullname = $1 AND email = $2)';

const userCheckExists = (dbConnection, fullname, email) =>
  dbConnection
    .query(checkFullname, [fullname, email])
    .then(res => res.rows[0].exists);

module.exports = userCheckExists;
