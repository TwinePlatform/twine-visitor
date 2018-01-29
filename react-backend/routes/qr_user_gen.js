const router = require('express').Router();
const qrCodeMaker = require('../functions/qrcodemaker');

router.post('/', (req, res, next) => {
  qrCodeMaker(req.body.hash, req.auth.cb_logo)
    .then(qr => res.send({ qr, cb_logo: req.auth.cb_logo }))
    .catch(next);
});

module.exports = router;
