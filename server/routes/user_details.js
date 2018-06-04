const router = require('express').Router();
const userDetails = require('../database/queries/user_details');
const qrCodeMaker = require('../functions/qrcodemaker');

router.post('/', (req, res, next) => {
  userDetails(req.app.get('client:psql'), { where: { cb_id: req.auth.cb_id, id: req.body.userId } })
    .then(({ hash, ...details }) => {
      qrCodeMaker(hash)
        .then((qrCode) => res.send({ result: { qrCode, ...details } }));
    })
    .catch(next);
});

module.exports = router;
