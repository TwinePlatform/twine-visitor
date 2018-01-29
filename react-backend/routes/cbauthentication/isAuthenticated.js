const jwt = require('jsonwebtoken');
const getCBFromEmail = require('../../database/queries/CBqueries/getCBFromEmail');

const isAuthenticated = (req, res, next) => {
  jwt.verify(req.headers.authorization, process.env.SECRET, (err, payload) => {
    if (err) {
      console.log(err);
      return next('notauthorized');
    }
    getCBFromEmail(payload.email)
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
