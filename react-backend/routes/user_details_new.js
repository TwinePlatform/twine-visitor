const router = require('express').Router();
const putNewUserDetails = require('../database/queries/putNewUserDetails');

router.post('/', (req, res, next) => {
  putNewUserDetails(
    req.auth.cb_id,
    req.body.userId,
    req.body.userFullName,
    req.body.sex,
    req.body.yearOfBirth,
    req.body.email
  )
    .then(details => res.send({ token: req.auth.adminToken, details }))
    .catch(next);
});

module.exports = router;
