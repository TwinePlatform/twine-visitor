const express = require('express');

const router = express.Router();

const getAllUsers = require('../database/queries/getAllUsers');

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
      .then(result => {
        if (result) {
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
      })
      .catch(error => {
        res.status(500).send(error);
      });
  });
});

module.exports = router;
