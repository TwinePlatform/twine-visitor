const jwt = require('jsonwebtoken');
const getCBFromEmail = require('../../database/queries/CBqueries/getCBFromEmail');

const adminIsAuthenticated = (req, res, next) => {
  jwt.verify(
    req.headers.authorization,
    process.env.ADMIN_SECRET,
    (err, payload) => {
      if (err) {
        return res.status(401).send({ error: 'Token expired' });
      }
      getCBFromEmail(payload.email)
        .then(cb => {
          const token = jwt.sign(
            { email: payload.email, admin: true },
            process.env.ADMIN_SECRET,
            { expiresIn: '5m' }
          );

          req.auth = req.auth || {};
          req.auth.cb_email = payload.email;
          req.auth.cb_id = cb.id;
          req.auth.cb_name = cb.org_name;
          req.auth.admin = true;
          req.auth.adminToken = token;
          next();
        })
        .catch(err => {
          console.log(err);
          return res.status(401).send({ error: 'Not logged in' });
        });
    }
  );
};

module.exports = adminIsAuthenticated;
