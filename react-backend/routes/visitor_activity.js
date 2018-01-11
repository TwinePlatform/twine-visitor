const express = require('express');
const putVisitsData = require('../database/queries/putVisitsData');

const router = express.Router();

router.post('/', (req, res, next) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', () => {
    const visitToAdd = JSON.parse(body);
    putVisitsData(visitToAdd.hash, visitToAdd.activity)
      .then(() => res.send('success'))
      .catch(next);
  });
});

module.exports = router;
