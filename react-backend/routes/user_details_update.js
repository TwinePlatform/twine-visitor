const router = require('express').Router();
const userUpdate = require('../database/queries/user_details_update');

router.post('/', (req, res, next) => {
  userUpdate(
    req.app.get('client:psql'),
    req.auth.cb_id,
    req.body.userId,
    req.body.userFullName,
    req.body.sex,
    req.body.yearOfBirth,
    req.body.email,
    req.body.phoneNumber,
    req.body.emailContact,
    req.body.smsContact
  )
    .then(details => res.send({ details }))
    .catch(next);
});

module.exports = router;
