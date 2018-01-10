const express = require('express');

const router = express.Router();

const hashCB = require('../functions/cbhash');
const getCBLoginDetailsValid = require('../database/queries/getCBlogindetailsvalid');

router.post('/', (req, res, next) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', () => {
    const bodyObject = JSON.parse(body);
    const hashedPassword = hashCB(bodyObject.password);
    getCBLoginDetailsValid(req.auth.cb_email, hashedPassword)
      .then(exists => {
        const loggedIn = exists
          ? { success: true }
          : { success: false, reason: 'incorrect password' };

        res.send(loggedIn);
      })
      .catch(next);
  });
});

module.exports = router;
