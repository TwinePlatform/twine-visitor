const router = require('express').Router();
const qrCodeMaker = require('../functions/qrcodemaker');

router.post('/', (req, res, next) => {
  qrCodeMaker(req.body.hash)
    .then(qr => res.send({ token: req.auth.adminToken, qr }))
    .catch(next);
});

module.exports = router;
