const express = require('express');

const router = express.Router();

const activitiesForToday = require('../database/queries/activitiesForToday');

const currentDate = new Date();
const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const today = days[currentDate.getDay()];

router.get('/', (req, res) => {
  activitiesForToday(req.auth.cb_id, today)
    .then(activities => res.send({ activities }))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});
module.exports = router;
