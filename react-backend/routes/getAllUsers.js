const express = require('express');
const hashCB = require('../functions/cbhash');
const getAllUsers = require('../database/queries/getAllUsers');
const getCBLoginDetailsValid = require('../database/queries/getCBlogindetailsvalid');

const router = express.Router();

router.post('/', (req, res, next) => {
  const hashedPassword = hashCB(req.body.password);
  getCBLoginDetailsValid(req.auth.cb_email, hashedPassword)
    .then(exists => {
      if (!exists) throw new Error('Incorrect password');
      console.log('hi');
      return req.auth.cb_id;
    })
    .then(getAllUsers)
    .then(users => res.send({ success: true, users }))
    .catch(err => {
      if (err.message !== 'Incorrect password') return next(err);
      res.send({
        success: false,
        reason: 'incorrect password',
      });
    });
});

module.exports = router;
