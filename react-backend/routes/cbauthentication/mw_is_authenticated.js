const jwt = require('jsonwebtoken');
const cbFromEmail = require('../../database/queries/cb/cb_from_email');

const isAuthenticated = (req, res, next) => {
  const standardJwtSecret = req.app.get('cfg').session.standard_jwt_secret;
  jwt.verify(req.headers.authorization, standardJwtSecret, (err, payload) => {
    if (err) {
      console.log(err);
      return next('notauthorized');
    }
    cbFromEmail(payload.email)
      .then(cb => {
        req.auth = req.auth || {};
        req.auth.cb_email = payload.email;
        req.auth.cb_id = cb.id;
        req.auth.cb_name = cb.org_name;
        req.auth.admin = false;
        req.auth.adminToken = null;
        req.auth.cb_logo = cb.uploadedfilecloudinaryurl;
        next();
      })
      .catch(err => {
        console.log(err);
        return next('notauthorized');
      });
  });
};

module.exports = isAuthenticated;
