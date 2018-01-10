const express = require('express');

const router = express.Router();

const getVisitsFilteredBy = require('../database/queries/getVisitsFilteredBy');

router.post('/', (req, res, next) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    getVisitsFilteredBy(req.auth.cb_id, body)
      .then(users => res.send({ success: true, users }))
      .catch((err) => {
        console.log(err);
        res.status(500).send(err);
      });
  });
});

module.exports = router;
