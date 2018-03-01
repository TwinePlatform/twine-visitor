const express = require('express');
const activityDelete = require('../database/queries/activity_delete');

const router = express.Router();

router.post('/', (req, res, next) => {
  activityDelete(req.app.get('client:psql'), req.body.id, req.auth.cb_id)
    .then(() => res.send({ success: 'success' }))
    .catch(next);
});

module.exports = router;
