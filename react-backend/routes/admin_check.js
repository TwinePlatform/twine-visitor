const express = require('express');

const router = express.Router();

router.post('/', (req, res) =>
  res.send({ success: true, token: req.auth.adminToken })
);

module.exports = router;
