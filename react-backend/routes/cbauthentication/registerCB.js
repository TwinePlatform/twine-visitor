const express = require('express');

const router = express.Router();

const hashCB = require('../../functions/cbhash');
const putCBData = require('../../database/queries/CBqueries/putCBData');
const sendCBemail = require('../../functions/sendCBemail');

router.post('/', (req, res, next) => {
  // TODO: use res.body!
  console.log('i am here in registerCB');
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    new Promise((resolve, reject) => {
      const details = JSON.parse(body);
      console.log(details);
      details.formPswd = hashCB(details.formPswd);
      const name = details.formName.toLowerCase();

      putCBData(name, details.formEmail, details.formGenre, details.formPswd, (err, res) => {
        if (err) {
          reject(err);
        } else {
          sendCBemail(details.formEmail, details.formName);
        }
        resolve(details);
        console.log(" I've finished with registerCB");
      });
    }).catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
  });
});

module.exports = router;
