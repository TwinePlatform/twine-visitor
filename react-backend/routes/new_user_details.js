const express = require('express');
const hashCB = require('../functions/cbhash');
const putNewUserDetails = require('../database/queries/putNewUserDetails');
const getUserDetails = require('../database/queries/getUserDetails');
const getCBLoginDetailsValid = require('../database/queries/getCBlogindetailsvalid');

const router = express.Router();

router.post('/', (req, res, next) => {
  const hashedPassword = hashCB(req.body.password);
  getCBLoginDetailsValid(req.auth.cb_email, hashedPassword)
    .then(exists => {
      if (!exists) throw new Error('Incorrect password');
      return req.auth.cb_id;
    })
    .then(() =>
      putNewUserDetails(
        req.auth.cb_id,
        req.body.userId,
        req.body.userFullName,
        req.body.sex,
        req.body.yearOfBirth,
        req.body.email
      )
    )
    .then(details => res.send({ success: true, details }))
    .catch(err => {
      if (err.message !== 'Incorrect password') return next(err);
      res.send({
        success: false,
        reason: 'incorrect password',
      });
    });
});

module.exports = router;
