const express = require('express');
const activityUpdate = require('../database/queries/activity_update');

const router = express.Router();

router.post('/', (req, res, next) => {
  const activity = req.body;
  activityUpdate(
    activity.id,
    activity.monday,
    activity.tuesday,
    activity.wednesday,
    activity.thursday,
    activity.friday,
    activity.saturday,
    activity.sunday,
    req.auth.cb_id
  )
    .then(() => res.send({ success: 'success' }))
    .catch(next);
});

module.exports = router;
