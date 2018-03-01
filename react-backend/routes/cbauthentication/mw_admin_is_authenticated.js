const jwt = require('jsonwebtoken');
const getCBFromEmail = require('../../database/queries/cb/cb_from_email');

const adminIsAuthenticated = (req, res, next) => {
  const cbAdminJwtSecret = req.app.get('cfg').session.cb_admin_jwt_secret;
  const pgClient = req.app.get('client:psql');

  jwt.verify(req.headers.authorization, cbAdminJwtSecret, (err, payload) => {
    if (err) {
      return res.status(401).send({ error: 'Token expired' });
    }
    getCBFromEmail(pgClient, payload.email)
      .then(cb => {
        const token = jwt.sign(
          { email: payload.email, admin: true },
          cbAdminJwtSecret,
          {
            expiresIn: '5m',
          }
        );

        req.auth = req.auth || {};
        req.auth.cb_email = payload.email;
        req.auth.cb_id = cb.id;
        req.auth.cb_name = cb.org_name;
        req.auth.admin = true;
        req.auth.cb_logo = cb.uploadedfilecloudinaryurl;
        res.set('Authorization', token);
        next();
      })
      .catch(err => {
        console.log(err);
        return res.status(401).send({ error: 'Not logged in' });
      });
  });
};

module.exports = adminIsAuthenticated;
