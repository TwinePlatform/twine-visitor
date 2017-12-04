const validator = require('validator');
const getCBAlreadyExists = require('../../database/queries/getCBAlreadyExists');
const express = require('express');

const router = express.Router();

router.post('/', (req, res, next) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', () => {
    const data = JSON.parse(body);
    if (data.formEmail.length === 0) {
      res.send('noinput');
    } else if (validator.isEmail(data.formEmail)) {
      getCBAlreadyExists(data.formEmail, (error, result) => {
        if (error) {
          console.log('error from getCBAlreadyExists ', error);
        } else {
          res.send(result.exists);
        }
      });
    } else if (!validator.isEmail(data.formEmail)) {
      console.log('This isnt a correct email!?');
      res.send('email');
    }
  });
});

module.exports = router;
