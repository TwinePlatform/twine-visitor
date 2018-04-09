const router = require('express').Router();
const { filter } = require('ramda');
const userUpdate = require('../database/queries/user_details_update');
const qrCodeMaker = require('../functions/qrcodemaker');


router.post('/', (req, res, next) => {
  const { userId, ...body } = req.body;
  const data = filter(Boolean, {
    fullName: body.userFullName,
    sex: body.sex,
    yearofbirth: body.yearOfBirth,
    email: body.email,
    phone_number: body.phone,
  });

  userUpdate(
    req.app.get('client:psql'),
    req.auth.cb_id,
    req.body.userId,
    data
  )
    .then(({ hash, ...details }) => {
      qrCodeMaker(hash)
        .then((qrCode) => res.send({ result: { qrCode, ...details } }));
    })
    .catch(next);
});

module.exports = router;
