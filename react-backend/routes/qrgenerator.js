const express = require('express');

const router = express.Router();

const hash = require('../functions/hash');
const qrmake = require('../functions/qrcodemaker');
const putUserData = require('../database/queries/putFormData');

let details = {};
let hashString = '';

router.post('/', (req, res, next) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    new Promise(((resolve, reject) => {
      details = JSON.parse(body);
      hashString = hash(details);
      details.formHash = hashString;
      console.log(details);

      putUserData(details.formSender, details.formSex, details.formYear, details.formEmail, details.formHash, (err, res) => {
        if (err) {
          console.log('I am postformdata error', err);
        } else {
          console.log('GREAT SUCCESS');
        }
      });

      resolve(hashString);
    }))
    // .then(res => console.log(res))
      .then(qrmake)
      .then(result => res.send(result))
      .catch((err) => {
        console.log(err);
      });
  });
});


module.exports = router;
