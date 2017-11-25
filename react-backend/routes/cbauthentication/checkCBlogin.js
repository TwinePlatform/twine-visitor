const validator = require('validator');

const express = require('express');

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
      res.send('noinput');
    } else if (validator.isEmail(data.formEmail)) {
      data.formPswd = hashCB(data.formPswd);
      getCBlogindetailsvalid(data.formEmail, data.formPswd, (error, result) => {
        if (error) {
          console.log('error from getCBlogindetailsvalid ', error);
        } else {
          res.send(result.rows[0].exists);
        }
      });
    } else if (!validator.isEmail(data.formEmail)) {
      console.log('This isnt a correct email!?');
      res.send('email');
    }
  });
});

module.exports = router;
