const router = require('express').Router();

router.post('/', (req, res) => res.send({ success: true }));

module.exports = router;
