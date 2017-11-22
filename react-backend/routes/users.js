const express = require('express');

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  // res.send('respond with a resource');
  res.send([
    {
      id: 1,
      username: 'RogerBacon',
    },
  ]);
});

module.exports = router;
