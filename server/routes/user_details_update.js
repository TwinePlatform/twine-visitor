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

  userUpdate(req.app.get('client:psql'), data, {
    where: { id: req.body.userId, cb_id: req.auth.cb_id },
    returning:
      'id, cb_id, fullname AS name, sex AS gender, yearofbirth AS yob, email, phone_number, date AS registered_at, hash, is_email_contact_consent_granted AS email_contact, is_sms_contact_consent_granted AS sms_contact',
  })
    .then(({ hash, ...details }) => {
      qrCodeMaker(hash).then(qrCode =>
        res.send({ result: { qrCode, ...details } })
      );
    })
    .catch(next);
});

module.exports = router;
