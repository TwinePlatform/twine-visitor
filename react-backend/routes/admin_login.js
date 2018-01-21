const express = require('express');
const jwt = require('jsonwebtoken');
const hashCB = require('../functions/cbhash');
const getCBLoginDetailsValid = require('../database/queries/getCBlogindetailsvalid');

const router = express.Router();

router.post('/', (req, res, next) => {
  const { password } = req.body;
  const hashedPassword = hashCB(password);

  getCBLoginDetailsValid(req.auth.cb_email, hashedPassword)
    .then(exists => {
      if (exists) {
        const token = jwt.sign(
          { email: req.auth.cb_email, admin: true },
          process.env.ADMIN_SECRET,
          { expiresIn: '5m' }
        );

        return res.send({ success: true, token });
      }
      res.send({ success: false, reason: 'Incorrect password' });
    })
    .catch(next);
});

module.exports = router;
