const validator = require('validator');

const express = require('express');
const jwt = require('jsonwebtoken');

const hashCB = require('../../functions/cbhash');

const router = express.Router();
const getCBlogindetailsvalid = require('../../database/queries/getCBlogindetailsvalid');

router.post('/', (req, res, next) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    const data = JSON.parse(body);
    if (data.formEmail.length === 0 || data.formPswd.length === 0) {
      res.send(
        JSON.stringify({
          reason: 'noinput',
        }),
      );
    } else if (validator.isEmail(data.formEmail)) {
      data.formPswd = hashCB(data.formPswd);
      getCBlogindetailsvalid(data.formEmail, data.formPswd, (error, result) => {
        if (error) {
          console.log('error from getCBlogindetailsvalid ', error);
          res.status(500).send(error);
        } else if (result.rows[0].exists) {
          // if CB exists we want to create jwt and send it to the frontend
          const token = jwt.sign({ email: data.formEmail }, process.env.SECRET);
          res.send(
            JSON.stringify({
              success: true,
              token,
            }),
          );
        } else {
          // we want to send false
          res.send(
            JSON.stringify({
              success: false,
            }),
          );
        }
      });
    } else if (!validator.isEmail(data.formEmail)) {
      console.log('This isnt a correct email!?');
      res.send(
        JSON.stringify({
          reason: 'email',
        }),
      );
    }
  });
});

module.exports = router;
