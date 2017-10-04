const express = require('express');

const router = express.Router();

const hash = require('../functions/hash');
const qrmake = require('../functions/qrcodemaker');


router.post('/', (req, res, next) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  req.on('end', () => new Promise(function(resolve, reject) {
      resolve(hash(JSON.parse(body)))
    })
    .then(qrmake)
    .then((result)=> res.send(result))
    .catch((err)=>{
      console.log(err);
    })
  );
});

module.exports = router;
