const express = require('express');
const activitiesForToday = require('../database/queries/activities_today');

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
  const pgClient = req.app.get('client:psql');

  activitiesForToday(pgClient, req.auth.cb_id, today)
    .then(activities => res.send({ activities }))
    .catch(next);
});

module.exports = router;
