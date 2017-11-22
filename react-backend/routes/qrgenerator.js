const express = require('express');

const router = express.Router();

const hash = require('../functions/hash');
const qrcodemaker = require('../functions/qrcodemaker');
const putUserData = require('../database/queries/putFormData');
const { sendQrCode } = require('./sendQrCode');

let details = {};
let hashString = '';

router.post('/', (req, res, next) => {
  // TODO: use res.body!
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', () => {
    new Promise((resolve, reject) => {
      details = JSON.parse(body);
      hashString = hash(details);
      details.formHash = hashString;
      const name = details.formSender.toLowerCase();

      putUserData(
        name,
        details.formSex,
        details.formYear,
        details.formEmail,
        details.formHash,
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            sendQrCode(details.formEmail, details.formSender, details.formHash);
          }
        },
      );
      resolve(hashString);
    })
      .then(qrcodemaker)
      .then(result => res.send(result))
      .catch(err => {
        console.log(err);
      });
  });
});

module.exports = router;
