const express = require('express');
const updateActivity = require('../database/queries/updateActivity');

const router = express.Router();

router.post('/', (req, res, next) => {
  const activity = req.body;
  updateActivity(
    activity.id,
    activity.monday,
    activity.tuesday,
    activity.wednesday,
    activity.thursday,
    activity.friday,
    activity.saturday,
    activity.sunday,
    req.auth.cb_id,
  )
    .then(() => res.send('success'))
    .catch(next);
});

module.exports = router;
