const express = require('express');
const hashCB = require('../../functions/cbhash');
const putCBData = require('../../database/queries/CBqueries/putCBData');
const sendCBemail = require('../../functions/sendCBemail');

const router = express.Router();

router.post('/', (req, res, next) => {
  // TODO: use res.body!
  // TODO: add validation within this route!!
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', () => {
    const details = JSON.parse(body);

    const hashedPassword = hashCB(details.formPswd);
    const name = details.formName.toLowerCase();

    putCBData(name, details.formEmail, details.formGenre, hashedPassword)
      .then(() => {
        sendCBemail(details.formEmail, details.formName);
        res.send({ success: true });
      })
      .catch(next);
  });
});

module.exports = router;
