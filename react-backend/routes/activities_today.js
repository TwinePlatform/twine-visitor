const express = require('express');
const activitiesForToday = require('../database/queries/activitiesForToday');

const router = express.Router();
const days = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

router.get('/', (req, res, next) => {
  const currentDate = new Date();
  const today = days[currentDate.getDay()];

  activitiesForToday(req.auth.cb_id, today)
    .then(activities => res.send({ activities, token: req.auth.adminToken }))
    .catch(next);
});

module.exports = router;
