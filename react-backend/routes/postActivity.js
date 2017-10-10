const express = require('express');

const router = express.Router();

const putVisitsData = require('../database/queries/putVisitsData');


router.post('/', (req, res, next) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
      let visitToAdd = JSON.parse(body);
      console.log(visitToAdd);
      putVisitsData(visitToAdd.hash, visitToAdd.activity, (error, result)=> {
        if (error) {
          console.log('I am an error from putVisitsData ', error)
        } else {
          res.send()
        }
      })

  })

})

module.exports = router;
