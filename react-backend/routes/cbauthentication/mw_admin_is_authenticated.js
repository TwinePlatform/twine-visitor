const jwt = require('jsonwebtoken');
const getCBFromEmail = require('../../database/queries/cb/cb_from_email');

const adminIsAuthenticated = (req, res, next) => {
  const secret = req.app.get('cfg').session.jwt_secret;

  jwt.verify(
    req.headers.authorization,
    secret,
    (err, payload) => {
      if (err) {
        return res.status(401).send({ error: 'Token expired' });
      }
      getCBFromEmail(payload.email)
        .then(cb => {
          const token = jwt.sign(
            { email: payload.email, admin: true },
            secret,
            { expiresIn: '5m' }
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
    }
  );
};

module.exports = adminIsAuthenticated;
