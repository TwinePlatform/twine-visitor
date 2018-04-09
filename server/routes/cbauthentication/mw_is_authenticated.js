const jwt = require('jsonwebtoken');
const Boom = require('boom');
const cbFromEmail = require('../../database/queries/cb/cb_from_email');

const isAuthenticated = (req, res, next) => {
  const standardJwtSecret = req.app.get('cfg').session.standard_jwt_secret;
  const pgClient = req.app.get('client:psql');

  jwt.verify(req.headers.authorization, standardJwtSecret, (err, payload) => {
    if (err) {
      return Boom.unauthorized('Standard token invalid');
    }

    cbFromEmail(pgClient, payload.email)
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
      .catch(next);
  });
};

module.exports = isAuthenticated;
