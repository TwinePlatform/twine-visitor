const router = require('express').Router();
const getUserDetails = require('../database/queries/getUserDetails');

router.post('/', (req, res, next) => {
  getUserDetails(req.auth.cb_id, req.body.userId)
    .then(details => res.send({ token: req.auth.adminToken, details }))
    .catch(next);
});

module.exports = router;
