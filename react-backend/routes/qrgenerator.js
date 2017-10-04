const express = require('express');

const router = express.Router();

const hash = require('../functions/hash');
const qrmake = require('../functions/qrcodemaker');


router.post('/', (req, res, next) => {
  let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      let code =  hash(JSON.parse(body));
      let qrUrl = qrmake(code);
      console.log(qrUrl);
      res.send(qrUrl);
    });
  //console.log(req.body);
  // res.json([{
  //   qr: 'QRRR Martin'
  // }]);
});

module.exports = router;
