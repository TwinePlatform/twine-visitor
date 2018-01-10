const express = require('express');

const router = express.Router();

const getAllUsers = require('../database/queries/getAllUsers');

const hashCB = require('../functions/cbhash');
const getCBLoginDetailsValid = require('../database/queries/getCBlogindetailsvalid');

router.post('/', (req, res, next) => {
  const hashedPassword = hashCB(req.body.password);
  getCBLoginDetailsValid(req.auth.cb_email, hashedPassword, (error, result) => {
    if (error) {
      res.status(500).send(error);
    } else if (result.rows[0].exists) {
      getAllUsers(req.auth.cb_id)
        .then(users => res.send({ success: true, users }))
        .catch(err => {
          console.log(err);
          res.status(500).send(err);
        });
    } else {
      res.send({
        success: false,
        reason: 'incorrect password'
      });
    }
  });
});

module.exports = router;
