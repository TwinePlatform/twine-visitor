const express = require('express');
const hashCB = require('../functions/cbhash');
const getCBDetails = require('../database/queries/getCBDetails');
const getCBLoginDetailsValid = require('../database/queries/getCBlogindetailsvalid');

const router = express.Router();

router.post('/', (req, res, next) => {
  const hashedPassword = hashCB(req.body.password);
  getCBLoginDetailsValid(req.auth.cb_email, hashedPassword)
    .then(exists => {
      if (!exists) throw new Error('Incorrect password');
    })
    .then(() => getCBDetails(req.auth.cb_id))
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
