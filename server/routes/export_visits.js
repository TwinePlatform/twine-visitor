const router = require('express').Router();
const visitsAllExport = require('../database/queries/visitors_all');

router.post('/', (req, res, next) => {
  visitsAllExport(req.app.get('client:psql'), req.auth.cb_id)
    .then(users => res.send({ result: users }))
    .catch(next);
});

module.exports = router;
