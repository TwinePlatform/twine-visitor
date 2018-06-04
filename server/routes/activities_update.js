const express = require('express');
const activityUpdate = require('../database/queries/activity_update');

const router = express.Router();

router.post('/', (req, res, next) => {
  const { id, ...activity } = req.body;
  activityUpdate(req.app.get('client:psql'), activity, {
    where: {
      id,
      cb_id: req.auth.cb_id,
    },
    returning: '*',
  })
    .then((data) => res.send({ result: data }))
    .catch(next);
});

module.exports = router;
